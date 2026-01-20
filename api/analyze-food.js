// Vercel Serverless Function - 食物分析 API
export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: '缺少图片数据' });
    }

    // 验证 API Key
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      console.error('错误：未设置 DASHSCOPE_API_KEY 环境变量');
      return res.status(500).json({ error: '服务器配置错误' });
    }

    // 调用阿里云通义千问 API
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-vl-plus',
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  image: `data:image/jpeg;base64,${image}`
                },
                {
                  text: `请识别图中的食物并提供估算的营养信息。请严格按照以下 JSON 格式返回，不要添加任何其他文字：
{
  "foodName": "食物的中文名称",
  "description": "食物的简短中文描述",
  "calories": 数字（总热量，单位千卡）,
  "macros": {
    "protein": 数字（蛋白质，单位克）,
    "carbs": 数字（碳水化合物，单位克）,
    "fat": 数字（脂肪，单位克）
  },
  "highlights": {
    "fiber": "关于纤维的描述，如'高纤维'或'低纤维'",
    "energy": "关于能量的描述，如'持久供能'或'快速补充'"
  }
}`
                }
              ]
            }
          ]
        }
      })
    });

    const result = await response.json();
    
    if (result.code) {
      console.error('通义千问 API 错误:', result);
      return res.status(500).json({ 
        error: 'AI 分析失败',
        message: result.message || '未知错误'
      });
    }

    // 解析返回的文本内容
    const content = result.output?.choices?.[0]?.message?.content;
    if (!content || content.length === 0) {
      throw new Error('AI 未返回有效内容');
    }

    // 提取文本内容
    const textContent = content.find(item => item.text)?.text || '';
    
    // 尝试从返回的文本中提取 JSON
    let nutritionData;
    try {
      nutritionData = JSON.parse(textContent);
    } catch {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        nutritionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析 AI 返回的数据');
      }
    }

    res.json(nutritionData);
  } catch (error) {
    console.error('API 调用失败:', error);
    res.status(500).json({ 
      error: 'AI 分析失败',
      message: error.message 
    });
  }
}
