
import React, { useState, useMemo } from 'react';
import { Meal } from '../types';

interface StatsViewProps {
  history: Meal[];
  userProfile: { dailyCalories: number; weight: number; goalWeight: number };
}

function getDateKey(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const StatsView: React.FC<StatsViewProps> = ({ history, userProfile }) => {
  const [range, setRange] = useState<'week' | 'month'>('week');

  const todayMeals = useMemo(() => {
    const todayKey = getDateKey(new Date().toISOString());
    return history.filter(m => getDateKey(m.created_at) === todayKey);
  }, [history]);

  const todayCalories = useMemo(() => {
    return todayMeals.reduce((sum, meal) => sum + meal.kcal, 0);
  }, [todayMeals]);

  const todayMacros = useMemo(() => {
    return todayMeals.reduce((acc, meal) => {
      if (meal.macros) {
        return {
          protein: acc.protein + (meal.macros.protein || 0),
          carbs: acc.carbs + (meal.macros.carbs || 0),
          fat: acc.fat + (meal.macros.fat || 0),
        };
      }
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });
  }, [todayMeals]);

  const macroRatios = useMemo(() => {
    const total = todayMacros.protein + todayMacros.carbs + todayMacros.fat;
    if (total === 0) return { protein: 33, carbs: 34, fat: 33 };
    return {
      protein: Math.round((todayMacros.protein / total) * 100),
      carbs: Math.round((todayMacros.carbs / total) * 100),
      fat: Math.round((todayMacros.fat / total) * 100),
    };
  }, [todayMacros]);

  const calByDate = useMemo(() => {
    const map: Record<string, number> = {};
    history.forEach(m => {
      const key = getDateKey(m.created_at);
      if (key) map[key] = (map[key] || 0) + m.kcal;
    });
    return map;
  }, [history]);

  const chartData = useMemo(() => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const today = new Date();

    if (range === 'week') {
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = getDateKey(d.toISOString());
        const cal = calByDate[key] || 0;
        result.push({
          label: i === 0 ? '今' : days[d.getDay()].replace('周', ''),
          cal,
          max: userProfile.dailyCalories,
          isToday: i === 0,
        });
      }
      return result;
    } else {
      const result = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = getDateKey(d.toISOString());
        const cal = calByDate[key] || 0;
        result.push({
          label: i === 0 ? '今' : i % 5 === 0 ? `${d.getDate()}` : '',
          cal,
          max: userProfile.dailyCalories,
          isToday: i === 0,
        });
      }
      return result;
    }
  }, [calByDate, range, userProfile.dailyCalories]);

  const maxVal = Math.max(...chartData.map(d => d.cal), userProfile.dailyCalories);
  const totalCal = chartData.reduce((s, d) => s + d.cal, 0);
  const daysWithData = chartData.filter(d => d.cal > 0).length;
  const avgCalories = daysWithData > 0 ? Math.round(totalCal / daysWithData) : 0;
  
  const proteinTarget = Math.round(userProfile.dailyCalories * 0.3 / 4);
  const proteinProgress = Math.min(Math.round((todayMacros.protein / proteinTarget) * 100), 100);

  const weightDiff = userProfile.weight - userProfile.goalWeight;
  const weightProgress = userProfile.goalWeight > 0 
    ? Math.min(Math.max(100 - (Math.abs(weightDiff) / userProfile.weight * 100), 0), 100) 
    : 0;

  return (
    <div className="h-full flex flex-col bg-[#F9FBFA] overflow-y-auto no-scrollbar pb-32">
      <header className="px-6 pt-10 pb-4 sticky top-0 z-20 bg-[#F9FBFA]/90 backdrop-blur-md flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">数据统计</h1>
        <div className="bg-white p-1 rounded-full border border-gray-100 flex shadow-sm">
            <button 
                onClick={() => setRange('week')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${range === 'week' ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}
            >
                本周
            </button>
            <button 
                onClick={() => setRange('month')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${range === 'month' ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}
            >
                本月
            </button>
        </div>
      </header>
      
      <div className="px-6 space-y-6 mt-2">
        
        {/* Calorie Trend Bar Chart */}
        <section className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col h-[280px]">
            <div className="flex items-start justify-between mb-8 shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">热量摄入</h2>
                    <p className="text-xs text-gray-400 font-medium mt-1">
                      {daysWithData > 0 ? `平均每日 ${avgCalories.toLocaleString()} 千卡` : '暂无数据'}
                    </p>
                </div>
                <div className="size-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                    <span className="material-symbols-outlined">local_fire_department</span>
                </div>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-[2px] px-1">
                {chartData.map((d: any, i) => {
                    const isOver = d.cal > d.max;
                    const heightPercent = maxVal > 0 ? Math.max(d.cal > 0 ? 8 : 2, Math.min((d.cal / (maxVal * 1.1)) * 100, 100)) : 2;
                    
                    return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer h-full justify-end">
                            <div className="relative w-full flex items-end justify-center h-[85%]">
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] py-1 px-2 rounded-lg font-bold whitespace-nowrap z-10 shadow-lg pointer-events-none">
                                    {d.cal > 0 ? `${d.cal} 千卡` : '无数据'}{d.isToday && ' (今天)'}
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                </div>
                                <div 
                                    className={`w-full rounded-full transition-all duration-700 ease-out ${
                                        range === 'week' ? 'max-w-[14px]' : 'max-w-[6px]'
                                    } ${
                                        d.cal === 0 
                                            ? 'bg-gray-100'
                                            : d.isToday 
                                                ? (isOver ? 'bg-orange-500 ring-2 ring-orange-200' : 'bg-primary ring-2 ring-primary/30') 
                                                : (isOver ? 'bg-orange-300' : 'bg-primary/60')
                                    }`}
                                    style={{ height: `${heightPercent}%` }}
                                ></div>
                                <div className={`absolute bottom-0 w-full ${range === 'week' ? 'max-w-[14px]' : 'max-w-[6px]'} h-full bg-gray-50 rounded-full -z-10`}></div>
                            </div>
                            {d.label && (
                              <span className={`text-[10px] font-bold uppercase h-[15%] flex items-start ${d.isToday ? 'text-primary' : 'text-gray-300'}`}>
                                  {d.label}
                              </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>

        {/* Nutrition Balance */}
        <section className="grid grid-cols-2 gap-4">
            <div className="bg-primary text-white p-5 rounded-[2rem] shadow-fab flex flex-col justify-between relative overflow-hidden h-[180px]">
                <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="relative z-10 mt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span className="text-xs font-bold opacity-80">今日表现</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight tracking-tight">
                        蛋白质摄入<br/>{proteinProgress >= 80 ? '完美达标' : proteinProgress >= 50 ? '进度良好' : todayMacros.protein === 0 ? '暂无数据' : '继续加油'}
                    </h3>
                </div>
                <div className="relative z-10 mb-2">
                    <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="bg-white h-full rounded-full shadow-sm transition-all duration-500" style={{ width: `${proteinProgress}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-2.5 text-[10px] font-bold opacity-90">
                        <span>{todayMacros.protein}g / {proteinTarget}g</span>
                        <span>{proteinProgress >= 80 ? '太棒了!' : `${proteinProgress}%`}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-[2rem] shadow-soft border border-gray-50 flex flex-col h-[180px] relative">
                 <h3 className="text-sm font-bold text-gray-800 mb-2">今日宏量比例</h3>
                 <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                     <div className="relative size-24">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                            <path className="text-accent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeDasharray={`${macroRatios.fat}, 100`} />
                            <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeDasharray={`${macroRatios.protein}, 100`} strokeDashoffset={`-${macroRatios.fat}`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">碳水</span>
                            <span className="text-lg font-black text-gray-800 leading-none">{macroRatios.carbs}%</span>
                        </div>
                     </div>
                     <div className="flex gap-3 mt-4">
                        <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary"></div><span className="text-[10px] font-bold text-gray-400">蛋{macroRatios.protein}%</span></div>
                        <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-accent"></div><span className="text-[10px] font-bold text-gray-400">脂{macroRatios.fat}%</span></div>
                        <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-gray-200"></div><span className="text-[10px] font-bold text-gray-400">碳{macroRatios.carbs}%</span></div>
                     </div>
                 </div>
            </div>
        </section>

        {/* Weight Progress */}
        <section className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-50 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">体重目标</h2>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                  weightDiff > 0 ? 'bg-blue-50' : weightDiff < 0 ? 'bg-orange-50' : 'bg-green-50'
                }`}>
                    <span className={`material-symbols-outlined text-sm ${
                      weightDiff > 0 ? 'text-blue-600' : weightDiff < 0 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {weightDiff > 0 ? 'trending_down' : weightDiff < 0 ? 'trending_up' : 'check_circle'}
                    </span>
                    <span className={`text-xs font-bold ${
                      weightDiff > 0 ? 'text-blue-600' : weightDiff < 0 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {Math.abs(weightDiff) < 0.1 ? '已达标' : `${weightDiff > 0 ? '需减' : '需增'} ${Math.abs(weightDiff).toFixed(1)}kg`}
                    </span>
                </div>
            </div>
            
            <div className="flex items-end justify-between mb-6">
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">当前</p>
                <p className="text-3xl font-black text-gray-800">{userProfile.weight}<span className="text-sm text-gray-400 ml-1">kg</span></p>
              </div>
              <div className="flex-1 mx-4 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-700" style={{ width: `${weightProgress}%` }}></div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">目标</p>
                <p className="text-3xl font-black text-primary">{userProfile.goalWeight}<span className="text-sm text-primary/60 ml-1">kg</span></p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="BMI" value={getBmiValue(userProfile.weight, 175)} tag={getBmiLabel(userProfile.weight, 175)} />
              <MiniStat label="本周记录" value={`${daysWithData}`} tag="天" />
              <MiniStat label="日均热量" value={avgCalories > 0 ? `${avgCalories}` : '-'} tag="kcal" />
            </div>
        </section>
      </div>
    </div>
  );
};

function getBmiValue(weight: number, height: number): string {
  return (weight / ((height / 100) ** 2)).toFixed(1);
}

function getBmiLabel(weight: number, height: number): string {
  const bmi = weight / ((height / 100) ** 2);
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '正常';
  if (bmi < 28) return '偏胖';
  return '肥胖';
}

const MiniStat = ({ label, value, tag }: { label: string; value: string; tag: string }) => (
  <div className="bg-gray-50 p-3 rounded-xl text-center">
    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</p>
    <p className="text-lg font-black text-gray-800">{value}</p>
    <p className="text-[10px] font-bold text-primary">{tag}</p>
  </div>
);

export default StatsView;
