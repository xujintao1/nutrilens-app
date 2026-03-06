
import React from 'react';
import { Screen, Meal, WaterRecord } from '../types';

interface DashboardProps {
  todayMeals: Meal[];
  allHistory: Meal[];
  userProfile: { name: string; dailyCalories: number };
  waterRecord: WaterRecord;
  onAddWater: () => void;
  onRemoveWater: () => void;
  onNavigate: (s: Screen) => void;
  onMealSelect: (meal: Meal) => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return '早上好';
  if (hour >= 12 && hour < 14) return '中午好';
  if (hour >= 14 && hour < 18) return '下午好';
  if (hour >= 18 && hour < 22) return '晚上好';
  return '夜深了';
}

const Dashboard: React.FC<DashboardProps> = ({ todayMeals, allHistory, userProfile, waterRecord, onAddWater, onRemoveWater, onNavigate, onMealSelect }) => {
  const today = new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' });
  
  const consumedCalories = todayMeals.reduce((sum, meal) => sum + meal.kcal, 0);
  const remainingCalories = userProfile.dailyCalories - consumedCalories;
  const progressPercent = Math.min((consumedCalories / userProfile.dailyCalories) * 100, 100);

  const totalMacros = todayMeals.reduce((acc, meal) => {
    if (meal.macros) {
      return {
        protein: acc.protein + (meal.macros.protein || 0),
        carbs: acc.carbs + (meal.macros.carbs || 0),
        fat: acc.fat + (meal.macros.fat || 0),
      };
    }
    return acc;
  }, { protein: 0, carbs: 0, fat: 0 });

  const macroTargets = {
    protein: Math.round(userProfile.dailyCalories * 0.3 / 4),
    carbs: Math.round(userProfile.dailyCalories * 0.5 / 4),
    fat: Math.round(userProfile.dailyCalories * 0.2 / 9),
  };

  const strokeDashoffset = 326.72 - (326.72 * progressPercent) / 100;
  const waterPercent = Math.min((waterRecord.glasses / waterRecord.goal) * 100, 100);

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar pb-32">
      <header className="flex items-center justify-between px-6 pt-10 pb-4 sticky top-0 bg-white/90 backdrop-blur-sm z-20">
        <div>
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{today}</h2>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">{getGreeting()}，{userProfile.name.split(' ')[0]}</h1>
        </div>
        <button onClick={() => onNavigate(Screen.PROFILE)} className="relative size-12 rounded-full overflow-hidden border-2 border-white shadow-sm active:scale-95 transition-transform">
          <img src="https://picsum.photos/seed/alex/200" className="w-full h-full object-cover" alt="Profile" />
          {todayMeals.length === 0 && (
            <div className="absolute top-0 right-0 h-3 w-3 bg-red-400 rounded-full border-2 border-white"></div>
          )}
        </button>
      </header>

      <main className="px-6 flex flex-col gap-6 mt-2">
        {/* Calorie Card */}
        <section 
            onClick={() => onNavigate(Screen.STATS)}
            className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-gray-50 relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-[4rem] rounded-tr-[2.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-tr-[3rem] rounded-bl-[2.5rem] -ml-4 -mb-4 transition-transform group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative size-56">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                <circle 
                    cx="60" cy="60" r="52" 
                    fill="transparent" 
                    stroke={remainingCalories < 0 ? '#ef4444' : '#8daa9d'}
                    strokeWidth="8" 
                    strokeDasharray="326.72" 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-5xl font-extrabold tracking-tighter ${remainingCalories < 0 ? 'text-red-500' : 'text-gray-800'}`}>
                    {remainingCalories}
                </span>
                <span className="text-sm font-medium text-gray-400 mt-1 uppercase">剩余千卡</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 bg-sage-light px-4 py-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-sm font-bold">trending_up</span>
              <p className="text-sm font-semibold text-primary-dark">
                  {remainingCalories < 0 
                    ? `今日已超标 ${Math.abs(remainingCalories)} 千卡` 
                    : consumedCalories === 0 
                      ? '今天还没有记录哦' 
                      : `已摄入 ${consumedCalories} 千卡`}
              </p>
            </div>
          </div>
        </section>

        {/* Macros */}
        <section className="grid grid-cols-3 gap-3" onClick={() => onNavigate(Screen.STATS)}>
          <MacroCard label="碳水" icon="bakery_dining" val={`${totalMacros.carbs}克`} target={`${macroTargets.carbs}克`} current={totalMacros.carbs} max={macroTargets.carbs} color="bg-yellow-400" bgColor="bg-cream-light" />
          <MacroCard label="蛋白质" icon="egg_alt" val={`${totalMacros.protein}克`} target={`${macroTargets.protein}克`} current={totalMacros.protein} max={macroTargets.protein} color="bg-primary" bgColor="bg-sage-light" />
          <MacroCard label="脂肪" icon="water_drop" val={`${totalMacros.fat}克`} target={`${macroTargets.fat}克`} current={totalMacros.fat} max={macroTargets.fat} color="bg-gray-400" bgColor="bg-gray-50" />
        </section>

        {/* Water Intake */}
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem] p-5 border border-blue-100/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500">water_drop</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">今日饮水</h3>
                <p className="text-[10px] text-gray-400 font-medium">{waterRecord.glasses} / {waterRecord.goal} 杯 (约 {waterRecord.glasses * 250}ml)</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={(e) => { e.stopPropagation(); onRemoveWater(); }}
                className="size-8 rounded-full bg-white/80 flex items-center justify-center text-gray-400 hover:text-blue-500 active:scale-90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddWater(); }}
                className="size-8 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 active:scale-90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: waterRecord.goal }, (_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  i < waterRecord.glasses ? 'bg-blue-400' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
          {waterPercent >= 100 && (
            <p className="text-[10px] text-blue-600 font-bold mt-2 text-center">饮水目标已达成!</p>
          )}
        </section>

        {/* Today's Meals */}
        <section>
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-lg font-bold text-gray-800">今日饮食 <span className="text-sm text-gray-400 font-medium">({todayMeals.length})</span></h3>
            <button 
                onClick={() => onNavigate(Screen.HISTORY)} 
                className="text-primary text-sm font-bold px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors"
            >
                查看全部
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {todayMeals.length === 0 ? (
                 <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-200">
                    <span className="material-symbols-outlined text-4xl text-gray-200 mb-2">restaurant</span>
                    <p className="text-gray-400 text-sm">暂无记录，快去拍照或添加食谱吧!</p>
                 </div>
            ) : (
                todayMeals.map(meal => (
                <div 
                    key={meal.id} 
                    onClick={() => onMealSelect(meal)}
                    className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-soft border border-transparent hover:border-primary/20 transition-all cursor-pointer active:scale-[0.99]"
                >
                    <div className="size-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    <img src={meal.image || 'https://picsum.photos/200'} className="w-full h-full object-cover" alt={meal.name} />
                    </div>
                    <div className="flex-1">
                    <p className="font-bold text-gray-800">{meal.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{meal.type} · {meal.time}</p>
                    </div>
                    <div className="text-right">
                    <p className="font-bold text-gray-800">{meal.kcal}</p>
                    <p className="text-xs text-gray-400 uppercase">千卡</p>
                    </div>
                </div>
                ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const MacroCard = ({ label, icon, val, target, current, max, color, bgColor }: any) => {
  const progressPercent = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  
  return (
    <div className={`flex flex-col gap-3 rounded-2xl p-4 ${bgColor} border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <p className="text-gray-800 text-sm font-bold">{label}</p>
        <span className="material-symbols-outlined text-gray-500 text-lg">{icon}</span>
      </div>
      <div>
        <p className="text-gray-800 text-xl font-bold tracking-tight">{val}</p>
        <p className="text-xs text-gray-400">/ {target}</p>
      </div>
      <div className="w-full bg-black/5 rounded-full h-1.5 mt-auto">
        <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${progressPercent}%` }}></div>
      </div>
    </div>
  );
};

export default Dashboard;
