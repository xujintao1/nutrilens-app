-- =====================================================
-- NutriLens 饮食 APP 数据库表结构
-- 请在 Supabase SQL Editor 中执行此脚本
-- =====================================================

-- 1. 创建用户配置表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  weight DECIMAL(5,2) DEFAULT 65.0,
  goal_weight DECIMAL(5,2) DEFAULT 60.0,
  daily_calories INT DEFAULT 2000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. 创建饮食记录表
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '加餐', -- 早餐、午餐、晚餐、加餐
  time TEXT NOT NULL DEFAULT '',
  calories INT NOT NULL DEFAULT 0,
  protein DECIMAL(6,2) DEFAULT 0,
  carbs DECIMAL(6,2) DEFAULT 0,
  fat DECIMAL(6,2) DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_created_at ON meals(created_at DESC);

-- 4. 启用 Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略 - 用户只能访问自己的数据

-- profiles 表策略
CREATE POLICY "用户可以查看自己的配置" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的配置" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "用户可以插入自己的配置" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- meals 表策略
CREATE POLICY "用户可以查看自己的饮食记录" ON meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以添加自己的饮食记录" ON meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的饮食记录" ON meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的饮食记录" ON meals
  FOR DELETE USING (auth.uid() = user_id);

-- 6. 创建自动创建用户配置的触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', '用户'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除已存在的触发器（如果有）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建触发器：新用户注册时自动创建配置
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 执行完毕！现在需要创建存储桶存放食物图片
-- 请在 Supabase 控制台 > Storage 中创建：
-- 桶名称: food-images
-- 公开访问: 是
-- =====================================================
