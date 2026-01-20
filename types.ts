
export enum Screen {
  AUTH = 'AUTH',
  SPLASH = 'SPLASH',
  DASHBOARD = 'DASHBOARD',
  STATS = 'STATS',
  RECIPES = 'RECIPES',
  RECIPE_DETAIL = 'RECIPE_DETAIL',
  CAMERA = 'CAMERA',
  RESULT = 'RESULT',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  HISTORY = 'HISTORY',
  MEAL_DETAIL = 'MEAL_DETAIL', // 新增餐食详情
  GOALS = 'GOALS',             // 新增目标设置
  NOTIFICATIONS = 'NOTIFICATIONS' // 新增通知中心
}

export interface Meal {
  id: string;
  name: string;
  type: '早餐' | '午餐' | '晚餐' | '加餐';
  time: string;
  kcal: number;
  image?: string;
  // 为了详情页，我们可以由AI估算或存储时保留这些数据，这里设为可选
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface NutritionData {
  foodName: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  highlights: {
    fiber: string;
    energy: string;
  };
}

export interface Recipe {
  id: number;
  title: string;
  desc: string;
  cal: string;
  image: string;
  ingredients: string[];
  steps: string[];
}
