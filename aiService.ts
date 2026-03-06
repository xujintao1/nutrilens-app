import { NutritionData } from "./types";
import { Capacitor } from '@capacitor/core';

const PRODUCTION_API_URL = (import.meta as any).env?.VITE_API_URL || 'https://nutrilens-app-lhl8.vercel.app';

const getApiBaseUrl = (): string => {
  if (PRODUCTION_API_URL) {
    return PRODUCTION_API_URL;
  }
  
  if (Capacitor.isNativePlatform()) {
    return 'http://192.168.16.251:3001';
  }
  
  return 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  try {
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