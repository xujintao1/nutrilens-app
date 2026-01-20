// Vercel Serverless Function - 健康检查
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ status: 'ok', message: 'NutriLens API is running on Vercel' });
}
