
import React, { useState, useEffect } from 'react';
import { Screen, Meal, NutritionData, Recipe } from './types';
import SplashScreen from './components/SplashScreen';
import AuthView from './components/AuthView';
import Dashboard from './components/Dashboard';
import { getCurrentUser, getUserProfile, getAllMeals, addMeal as addMealToDb, deleteMeal as deleteMealFromDb, upsertUserProfile, onAuthStateChange } from './lib/supabase';
import CameraView from './components/CameraView';
import ResultView from './components/ResultView';
import ProfileView from './components/ProfileView';
import StatsView from './components/StatsView';
import RecipesView from './components/RecipesView';
import BottomNav from './components/BottomNav';
import SettingsView from './components/SettingsView';
import HistoryView from './components/HistoryView';
import MealDetailView from './components/MealDetailView';
import GoalsView from './components/GoalsView';
import NotificationsView from './components/NotificationsView';
import RecipeDetailView from './components/RecipeDetailView'; // Imported new component

const STORAGE_KEY_PROFILE = 'nutrilens_profile_v1';
const STORAGE_KEY_HISTORY = 'nutrilens_history_v1';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.AUTH);
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [previousScreen, setPreviousScreen] = useState<Screen>(Screen.DASHBOARD);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // 默认初始数据
  const defaultProfile = {
    name: 'Alex Wang',
    weight: 68.5,
    goalWeight: 65.0,
    dailyCalories: 2000,
    height: 175
  };

  const defaultHistory: Meal[] = [
    {
      id: '1',
      name: '燕麦片配莓果',
      type: '早餐',
      time: '上午 8:30',
      kcal: 350,
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=200&h=200',
      macros: { protein: 12, carbs: 45, fat: 6 }
    },
    {
      id: '2',
      name: '香煎鸡肉沙拉',
      type: '午餐',
      time: '下午 12:15',
      kcal: 480,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&h=200',
      macros: { protein: 40, carbs: 15, fat: 20 }
    }
  ];

  // 全局用户状态
  const [userProfile, setUserProfile] = useState(defaultProfile);
  const [history, setHistory] = useState<Meal[]>(defaultHistory);
  const [isLoaded, setIsLoaded] = useState(false);

  // 检查用户认证状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // 从 Supabase 加载用户数据
          await loadUserData(currentUser.id);
          setCurrentScreen(Screen.SPLASH);
        } else {
          setCurrentScreen(Screen.AUTH);
        }
      } catch (e: any) {
        // AuthSessionMissingError 是正常的（用户未登录），不需要报错
        if (!e?.message?.includes('Auth session missing')) {
          console.error('Auth check failed:', e);
        }
        setCurrentScreen(Screen.AUTH);
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
    
    // 监听认证状态变化
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
      if (!user) {
        setCurrentScreen(Screen.AUTH);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // 从 Supabase 加载用户数据
  const loadUserData = async (userId: string) => {
    try {
      // 加载用户配置
      const profile = await getUserProfile(userId);
      if (profile) {
        setUserProfile({
          name: profile.name || 'User',
          weight: profile.weight || 65,
          goalWeight: profile.goal_weight || 60,
          dailyCalories: profile.daily_calories || 2000,
          height: 175
        });
      }
      
      // 加载饮食记录
      const meals = await getAllMeals(userId);
      if (meals.length > 0) {
        setHistory(meals.map(m => ({
          id: m.id,
          name: m.name,
          type: m.type as any,
          time: m.time,
          kcal: m.calories,
          image: m.image_url,
          macros: { protein: m.protein, carbs: m.carbs, fat: m.fat }
        })));
      }
    } catch (e) {
      console.error('Failed to load user data:', e);
      // 失败时使用本地存储作为备份
      loadFromLocalStorage();
    } finally {
      setIsLoaded(true);
    }
  };
  
  // 从本地存储加载（备份）
  const loadFromLocalStorage = () => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);

      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load local storage data", e);
    }
    setIsLoaded(true);
  };
  
  // 认证成功后的处理
  const handleAuthSuccess = async () => {
    setIsAuthChecking(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadUserData(currentUser.id);
        setCurrentScreen(Screen.SPLASH);
      }
    } catch (e) {
      console.error('Auth success handling failed:', e);
    } finally {
      setIsAuthChecking(false);
    }
  };

  // Save data whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
    }
  }, [userProfile, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      // Create a lightweight version of history for storage if images are base64 (to avoid QuotaExceeded)
      // For this demo, we assume storage is sufficient, but in production, we'd handle images differently.
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  // Handle Reset Data (passed to SettingsView)
  const handleResetData = () => {
    if (window.confirm('确定要重置所有数据吗？这将清空你的历史记录。')) {
      setUserProfile(defaultProfile);
      setHistory(defaultHistory);
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      alert('数据已重置');
    }
  };

  useEffect(() => {
    if (currentScreen === Screen.SPLASH && user) {
      const timer = setTimeout(() => setCurrentScreen(Screen.DASHBOARD), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, user]);

  const handleCapture = (base64: string) => {
    setCapturedImage(base64);
    setCurrentScreen(Screen.RESULT);
  };

  const handleAddToLog = async (data: NutritionData) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: data.foodName,
      type: '加餐',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      kcal: data.calories,
      image: capturedImage ? `data:image/jpeg;base64,${capturedImage}` : undefined,
      macros: data.macros
    };
    
    // 保存到 Supabase
    if (user) {
      try {
        const saved = await addMealToDb({
          user_id: user.id,
          name: data.foodName,
          type: '加餐',
          time: newMeal.time,
          calories: data.calories,
          protein: data.macros.protein,
          carbs: data.macros.carbs,
          fat: data.macros.fat,
          image_url: newMeal.image
        });
        newMeal.id = saved.id;
      } catch (e) {
        console.error('Failed to save to Supabase:', e);
      }
    }
    
    setHistory([newMeal, ...history]);
    setCurrentScreen(Screen.DASHBOARD);
  };

  // 将食谱添加为今日饮食
  const handleAddRecipeToLog = (recipe: Recipe) => {
    const cal = parseInt(recipe.cal.replace(/\D/g, '')) || 400; // 提取数字
    const newMeal: Meal = {
        id: Date.now().toString(),
        name: recipe.title,
        type: '午餐', 
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        kcal: cal,
        image: recipe.image
    };
    setHistory([newMeal, ...history]);
    setCurrentScreen(Screen.DASHBOARD);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentScreen(Screen.RECIPE_DETAIL);
  };

  const handleMealSelect = (meal: Meal) => {
    setSelectedMeal(meal);
    setPreviousScreen(currentScreen);
    setCurrentScreen(Screen.MEAL_DETAIL);
  };

  // 删除记录
  const handleDeleteMeal = async (mealId: string) => {
    // 从 Supabase 删除
    if (user) {
      try {
        await deleteMealFromDb(mealId);
      } catch (e) {
        console.error('Failed to delete from Supabase:', e);
      }
    }
    setHistory(history.filter(m => m.id !== mealId));
    setCurrentScreen(previousScreen); 
  };

  // 更新用户目标
  const handleUpdateGoals = async (newProfile: Partial<typeof userProfile>) => {
    const updated = { ...userProfile, ...newProfile };
    setUserProfile(updated);
    
    // 同步到 Supabase
    if (user) {
      try {
        await upsertUserProfile({
          id: user.id,
          name: updated.name,
          weight: updated.weight,
          goal_weight: updated.goalWeight,
          daily_calories: updated.dailyCalories
        });
      } catch (e) {
        console.error('Failed to update profile in Supabase:', e);
      }
    }
  };

  const showBottomNav = [Screen.DASHBOARD, Screen.STATS, Screen.RECIPES, Screen.PROFILE].includes(currentScreen);

  return (
    <div className="max-w-md mx-auto h-screen bg-white relative overflow-hidden shadow-2xl flex flex-col">
      {currentScreen === Screen.AUTH && <AuthView onAuthSuccess={handleAuthSuccess} />}
      {currentScreen === Screen.SPLASH && <SplashScreen />}
      
      <div className="flex-1 relative overflow-hidden">
        {currentScreen === Screen.DASHBOARD && (
            <Dashboard 
            history={history} 
            userProfile={userProfile}
            onNavigate={(s) => setCurrentScreen(s)} 
            onMealSelect={handleMealSelect}
            />
        )}
        
        {currentScreen === Screen.STATS && (
            <StatsView history={history} userProfile={userProfile} />
        )}
        
        {currentScreen === Screen.RECIPES && (
            <RecipesView onRecipeSelect={handleRecipeSelect} />
        )}

        {/* 使用提取出的 RecipeDetailView 组件 */}
        {currentScreen === Screen.RECIPE_DETAIL && selectedRecipe && (
            <RecipeDetailView 
                recipe={selectedRecipe}
                onBack={() => setCurrentScreen(Screen.RECIPES)}
                onAdd={handleAddRecipeToLog}
            />
        )}

        {currentScreen === Screen.PROFILE && (
            <ProfileView 
                userProfile={userProfile}
                onNavigate={(s) => setCurrentScreen(s)}
                onLogout={() => {
                    setUser(null);
                    setCurrentScreen(Screen.AUTH);
                }}
            />
        )}

        {currentScreen === Screen.SETTINGS && (
            <SettingsView 
                userProfile={userProfile}
                onUpdateProfile={handleUpdateGoals}
                onResetData={handleResetData}
                onBack={() => setCurrentScreen(Screen.PROFILE)} 
            />
        )}

        {currentScreen === Screen.HISTORY && (
            <HistoryView 
                history={history} 
                onBack={() => setCurrentScreen(Screen.PROFILE)}
                onMealSelect={handleMealSelect}
            />
        )}

        {currentScreen === Screen.MEAL_DETAIL && selectedMeal && (
            <MealDetailView 
                meal={selectedMeal} 
                onDelete={handleDeleteMeal}
                onBack={() => setCurrentScreen(previousScreen)} 
            />
        )}

        {currentScreen === Screen.GOALS && (
            <GoalsView 
                userProfile={userProfile}
                onUpdate={handleUpdateGoals}
                onBack={() => setCurrentScreen(Screen.PROFILE)} 
            />
        )}

        {currentScreen === Screen.NOTIFICATIONS && (
            <NotificationsView onBack={() => setCurrentScreen(Screen.PROFILE)} />
        )}

        {currentScreen === Screen.CAMERA && (
            <CameraView 
            onCapture={handleCapture} 
            onClose={() => setCurrentScreen(Screen.DASHBOARD)} 
            />
        )}
        
        {currentScreen === Screen.RESULT && capturedImage && (
            <ResultView 
            image={capturedImage} 
            onAdd={handleAddToLog}
            onBack={() => setCurrentScreen(Screen.CAMERA)}
            />
        )}
      </div>

      {showBottomNav && (
        <BottomNav 
          currentScreen={currentScreen} 
          onNavigate={(s) => setCurrentScreen(s)} 
        />
      )}
    </div>
  );
};

export default App;
