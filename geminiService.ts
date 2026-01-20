import { NutritionData } from "./types";
import { Capacitor } from '@capacitor/core';

// API 服务器地址配置
// 部署到 Vercel 后，请将此 URL 替换为你的 Vercel 项目地址
// 例如：https://nutrilens-api.vercel.app
const PRODUCTION_API_URL = 'https://nutrilens-app-two.vercel.app';

const getApiBaseUrl = (): string => {
  // 如果已配置生产环境 URL，优先使用
  if (PRODUCTION_API_URL) {
    return PRODUCTION_API_URL;
  }
  
  // 原生 App 中使用局域网 IP（开发测试用）
  if (Capacitor.isNativePlatform()) {
    return 'http://192.168.16.251:3001';
  }
  
  // Web 端使用 localhost
  return 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  try {
    // 调用后端 API 代理，而不是直接调用 Gemini
    const response = await fetch(`${API_BASE_URL}/api/analyze-food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API 请求失败: ${response.status}`);
    }

    const nutritionData = await response.json();
    return nutritionData as NutritionData;
  } catch (error) {
    console.error('食物分析失败:', error);
    throw error;
  }
};