
import React from 'react';
import { Screen, Meal } from '../types';

interface DashboardProps {
  history: Meal[];
  userProfile: { name: string; dailyCalories: number };
  onNavigate: (s: Screen) => void;
  onMealSelect: (meal: Meal) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, userProfile, onNavigate, onMealSelect }) => {
  const today = new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' });
  
  // Calculate consumed calories
  const consumedCalories = history.reduce((sum, meal) => sum + meal.kcal, 0);
  const remainingCalories = userProfile.dailyCalories - consumedCalories;
  const progressPercent = Math.min((consumedCalories / userProfile.dailyCalories) * 100, 100);

  // 动态计算宏量营养素总量
  const totalMacros = history.reduce((acc, meal) => {
    if (meal.macros) {
      return {
        protein: acc.protein + (meal.macros.protein || 0),
        carbs: acc.carbs + (meal.macros.carbs || 0),
        fat: acc.fat + (meal.macros.fat || 0),
      };
    }
    return acc;
  }, { protein: 0, carbs: 0, fat: 0 });

  // 每日目标（可以从 userProfile 扩展）
  const macroTargets = {
    protein: 150, // 克
    carbs: 250,   // 克
    fat: 70,      // 克
  };

  // Dash array for circle (2 * PI * R). R=52 => ~326.72
  const strokeDashoffset = 326.72 - (326.72 * progressPercent) / 100;

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10 pb-4 sticky top-0 bg-white/90 backdrop-blur-sm z-20">
        <div>
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{today}</h2>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">早上好，{userProfile.name.split(' ')[0]}</h1>
        </div>
        <button onClick={() => onNavigate(Screen.PROFILE)} className="relative size-12 rounded-full overflow-hidden border-2 border-white shadow-sm active:scale-95 transition-transform">
          <img src="https://picsum.photos/seed/alex/200" className="w-full h-full object-cover" alt="Profile" />
          <div className="absolute top-0 right-0 h-3 w-3 bg-red-400 rounded-full border-2 border-white"></div>
        </button>
      </header>

      <main className="px-6 flex flex-col gap-6 mt-2">
        {/* Calorie Card - Click to Stats */}
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
                    cx="60" 
                    cy="60" 
                    r="52" 
                    fill="transparent" 
                    stroke="#8daa9d" 
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
                  {remainingCalories < 0 ? '今日热量已超标' : '今日目标进度良好'}
              </p>
            </div>
          </div>
        </section>

        {/* Macros - Click to Stats */}
        <section className="grid grid-cols-3 gap-3" onClick={() => onNavigate(Screen.STATS)}>
          <MacroCard label="碳水" icon="bakery_dining" val={`${totalMacros.carbs}克`} target={`${macroTargets.carbs}克`} current={totalMacros.carbs} max={macroTargets.carbs} color="bg-yellow-400" bgColor="bg-cream-light" />
          <MacroCard label="蛋白质" icon="egg_alt" val={`${totalMacros.protein}克`} target={`${macroTargets.protein}克`} current={totalMacros.protein} max={macroTargets.protein} color="bg-primary" bgColor="bg-sage-light" />
          <MacroCard label="脂肪" icon="water_drop" val={`${totalMacros.fat}克`} target={`${macroTargets.fat}克`} current={totalMacros.fat} max={macroTargets.fat} color="bg-gray-400" bgColor="bg-gray-50" />
        </section>

        {/* History */}
        <section>
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-lg font-bold text-gray-800">今日饮食</h3>
            <button 
                onClick={() => onNavigate(Screen.HISTORY)} 
                className="text-primary text-sm font-bold px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors"
            >
                查看全部
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {history.length === 0 ? (
                 <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">暂无记录，快去拍照或添加食谱吧！</p>
                 </div>
            ) : (
                history.map(meal => (
                <div 
                    key={meal.id} 
                    onClick={() => onMealSelect(meal)}
                    className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-soft border border-transparent hover:border-primary/20 transition-all cursor-pointer active:scale-[0.99]"
                >
                    <div className="size-16 rounded-xl overflow-hidden shrink-0">
                    <img src={meal.image || 'https://picsum.photos/200'} className="w-full h-full object-cover" alt={meal.name} />
                    </div>
                    <div className="flex-1">
                    <p className="font-bold text-gray-800">{meal.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{meal.type} • {meal.time}</p>
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
  // 计算进度百分比，最大不超过 100%
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
