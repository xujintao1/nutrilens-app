
import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Meal, NutritionData, Recipe, MealType, WaterRecord } from './types';
import SplashScreen from './components/SplashScreen';
import AuthView from './components/AuthView';
import Dashboard from './components/Dashboard';
import { getCurrentUser, getUserProfile, getAllMeals, addMeal as addMealToDb, deleteMeal as deleteMealFromDb, deleteAllMeals, upsertUserProfile, onAuthStateChange } from './lib/supabase';
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
import RecipeDetailView from './components/RecipeDetailView';

const STORAGE_KEY_PROFILE = 'nutrilens_profile_v1';
const STORAGE_KEY_HISTORY = 'nutrilens_history_v1';
const STORAGE_KEY_WATER = 'nutrilens_water_v1';

function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth() === now.getMonth() &&
         d.getDate() === now.getDate();
}

function getAutoMealType(): MealType {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return '早餐';
  if (hour >= 10 && hour < 14) return '午餐';
  if (hour >= 14 && hour < 20) return '晚餐';
  return '加餐';
}

function getTodayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.AUTH);
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [previousScreen, setPreviousScreen] = useState<Screen>(Screen.DASHBOARD);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [pendingMealType, setPendingMealType] = useState<MealType>(getAutoMealType());

  const defaultProfile = {
    name: 'User',
    weight: 68.5,
    goalWeight: 65.0,
    dailyCalories: 2000,
    height: 175
  };

  const [userProfile, setUserProfile] = useState(defaultProfile);
  const [history, setHistory] = useState<Meal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [waterRecord, setWaterRecord] = useState<WaterRecord>({
    date: getTodayDateStr(),
    glasses: 0,
    goal: 8
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATER);
      if (saved) {
        const parsed: WaterRecord = JSON.parse(saved);
        if (parsed.date === getTodayDateStr()) {
          setWaterRecord(parsed);
        }
      }
    } catch (e) { /* ignore */ }
  }, []);

  const todayMeals = history.filter(m => isToday(m.created_at));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadUserData(currentUser.id);
          setCurrentScreen(Screen.SPLASH);
        } else {
          setCurrentScreen(Screen.AUTH);
        }
      } catch (e: any) {
        if (!e?.message?.includes('Auth session missing')) {
          console.error('Auth check failed:', e);
        }
        setCurrentScreen(Screen.AUTH);
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
      if (!user) {
        setCurrentScreen(Screen.AUTH);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const loadUserData = async (userId: string) => {
    try {
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
      
      const meals = await getAllMeals(userId);
      if (meals.length > 0) {
        setHistory(meals.map(m => ({
          id: m.id,
          name: m.name,
          type: m.type as MealType,
          time: m.time,
          kcal: m.calories,
          image: m.image_url,
          created_at: m.created_at,
          macros: { protein: m.protein, carbs: m.carbs, fat: m.fat }
        })));
      }
    } catch (e) {
      console.error('Failed to load user data:', e);
      loadFromLocalStorage();
    } finally {
      setIsLoaded(true);
    }
  };
  
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

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
    }
  }, [userProfile, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const lightweight = history.map(m => ({
        ...m,
        image: m.image && m.image.length > 500 ? undefined : m.image
      }));
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(lightweight));
    }
  }, [history, isLoaded]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WATER, JSON.stringify(waterRecord));
  }, [waterRecord]);

  const handleResetData = async () => {
    if (window.confirm('确定要重置所有数据吗？这将清空你的所有饮食记录。')) {
      if (user) {
        try {
          await deleteAllMeals(user.id);
        } catch (e) {
          console.error('Failed to delete Supabase meals:', e);
        }
      }
      setUserProfile(defaultProfile);
      setHistory([]);
      setWaterRecord({ date: getTodayDateStr(), glasses: 0, goal: 8 });
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      localStorage.removeItem(STORAGE_KEY_WATER);
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
    setPendingMealType(getAutoMealType());
    setCurrentScreen(Screen.RESULT);
  };

  const handleAddToLog = async (data: NutritionData, mealType?: MealType) => {
    const type = mealType || pendingMealType;
    const now = new Date();
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: data.foodName,
      type,
      time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      kcal: data.calories,
      image: capturedImage ? `data:image/jpeg;base64,${capturedImage}` : undefined,
      created_at: now.toISOString(),
      macros: data.macros
    };
    
    if (user) {
      try {
        const saved = await addMealToDb({
          user_id: user.id,
          name: data.foodName,
          type,
          time: newMeal.time,
          calories: data.calories,
          protein: data.macros.protein,
          carbs: data.macros.carbs,
          fat: data.macros.fat,
          image_url: newMeal.image
        });
        newMeal.id = saved.id;
        newMeal.created_at = saved.created_at;
      } catch (e) {
        console.error('Failed to save to Supabase:', e);
      }
    }
    
    setHistory([newMeal, ...history]);
    setCurrentScreen(Screen.DASHBOARD);
  };

  const handleAddRecipeToLog = async (recipe: Recipe) => {
    const cal = parseInt(recipe.cal.replace(/\D/g, '')) || 400;
    const type = getAutoMealType();
    const now = new Date();
    const newMeal: Meal = {
        id: Date.now().toString(),
        name: recipe.title,
        type,
        time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        kcal: cal,
        image: recipe.image,
        created_at: now.toISOString(),
        macros: { protein: Math.round(cal * 0.25 / 4), carbs: Math.round(cal * 0.5 / 4), fat: Math.round(cal * 0.25 / 9) }
    };
    
    if (user) {
      try {
        const saved = await addMealToDb({
          user_id: user.id,
          name: recipe.title,
          type,
          time: newMeal.time,
          calories: cal,
          protein: newMeal.macros!.protein,
          carbs: newMeal.macros!.carbs,
          fat: newMeal.macros!.fat,
          image_url: recipe.image
        });
        newMeal.id = saved.id;
        newMeal.created_at = saved.created_at;
      } catch (e) {
        console.error('Failed to save recipe to Supabase:', e);
      }
    }
    
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

  const handleDeleteMeal = async (mealId: string) => {
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

  const handleUpdateGoals = async (newProfile: Partial<typeof userProfile>) => {
    const updated = { ...userProfile, ...newProfile };
    setUserProfile(updated);
    
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

  const handleAddWater = useCallback(() => {
    setWaterRecord(prev => {
      const today = getTodayDateStr();
      if (prev.date !== today) {
        return { date: today, glasses: 1, goal: prev.goal };
      }
      return { ...prev, glasses: prev.glasses + 1 };
    });
  }, []);

  const handleRemoveWater = useCallback(() => {
    setWaterRecord(prev => ({
      ...prev,
      glasses: Math.max(0, prev.glasses - 1)
    }));
  }, []);

  const showBottomNav = [Screen.DASHBOARD, Screen.STATS, Screen.RECIPES, Screen.PROFILE].includes(currentScreen);

  return (
    <div className="max-w-md mx-auto h-screen bg-white relative overflow-hidden shadow-2xl flex flex-col">
      {currentScreen === Screen.AUTH && <AuthView onAuthSuccess={handleAuthSuccess} />}
      {currentScreen === Screen.SPLASH && <SplashScreen />}
      
      <div className="flex-1 relative overflow-hidden">
        {currentScreen === Screen.DASHBOARD && (
            <Dashboard 
            todayMeals={todayMeals}
            allHistory={history}
            userProfile={userProfile}
            waterRecord={waterRecord}
            onAddWater={handleAddWater}
            onRemoveWater={handleRemoveWater}
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
                history={history}
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
            <NotificationsView 
                todayMeals={todayMeals}
                userProfile={userProfile}
                onBack={() => setCurrentScreen(Screen.PROFILE)} 
            />
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
