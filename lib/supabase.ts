import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = 'https://ukjrlajixqyslfiruvif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVranJsYWppeHF5c2xmaXJ1dmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODQyMDcsImV4cCI6MjA4NDE2MDIwN30.nTep95FVDmHrp0X6tjqp_Z-qwIPjwHV6vc3xMcs_bWM';

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 类型定义
export interface UserProfile {
  id: string;
  name: string;
  weight: number;
  goal_weight: number;
  daily_calories: number;
  created_at?: string;
  updated_at?: string;
}

export interface MealRecord {
  id: string;
  user_id: string;
  name: string;
  type: string; // 早餐、午餐、晚餐、加餐
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image_url?: string;
  created_at?: string;
}

// ==================== 用户认证服务 ====================

/**
 * 邮箱注册
 */
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  
  if (error) throw error;
  return data;
}

/**
 * 邮箱登录
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

/**
 * 退出登录
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}

// ==================== 用户配置服务 ====================

/**
 * 获取用户配置
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * 创建或更新用户配置
 */
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      ...profile,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==================== 饮食记录服务 ====================

/**
 * 获取用户的饮食记录（今日）
 */
export async function getTodayMeals(userId: string): Promise<MealRecord[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

/**
 * 获取用户的所有饮食记录
 */
export async function getAllMeals(userId: string, limit = 50): Promise<MealRecord[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

/**
 * 添加饮食记录
 */
export async function addMeal(meal: Omit<MealRecord, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('meals')
    .insert(meal)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * 删除饮食记录
 */
export async function deleteMeal(mealId: string) {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId);
  
  if (error) throw error;
}

/**
 * 更新饮食记录
 */
export async function updateMeal(mealId: string, updates: Partial<MealRecord>) {
  const { data, error } = await supabase
    .from('meals')
    .update(updates)
    .eq('id', mealId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==================== 图片存储服务 ====================

/**
 * 上传食物图片
 */
export async function uploadFoodImage(userId: string, file: File | Blob, fileName: string) {
  const filePath = `${userId}/${Date.now()}_${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('food-images')
    .upload(filePath, file);
  
  if (error) throw error;
  
  // 获取公开 URL
  const { data: { publicUrl } } = supabase.storage
    .from('food-images')
    .getPublicUrl(filePath);
  
  return publicUrl;
}

/**
 * 从 base64 上传图片
 */
export async function uploadFoodImageFromBase64(userId: string, base64: string, fileName: string) {
  // 将 base64 转换为 Blob
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  
  return uploadFoodImage(userId, blob, fileName);
}
