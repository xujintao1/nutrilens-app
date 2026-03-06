
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
  MEAL_DETAIL = 'MEAL_DETAIL',
  GOALS = 'GOALS',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

export const MEAL_TYPES = ['早餐', '午餐', '晚餐', '加餐'] as const;
export type MealType = typeof MEAL_TYPES[number];

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  time: string;
  kcal: number;
  image?: string;
  created_at?: string;
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

export interface WaterRecord {
  date: string;
  glasses: number;
  goal: number;
}
