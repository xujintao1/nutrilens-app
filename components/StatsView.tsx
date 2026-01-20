
import React, { useState, useMemo } from 'react';
import { Meal } from '../types';

interface StatsViewProps {
  history: Meal[];
  userProfile: { dailyCalories: number; weight: number; goalWeight: number };
}

const StatsView: React.FC<StatsViewProps> = ({ history, userProfile }) => {
  const [range, setRange] = useState<'week' | 'month'>('week');

  // 计算今日总热量
  const todayCalories = useMemo(() => {
    return history.reduce((sum, meal) => sum + meal.kcal, 0);
  }, [history]);

  // 计算今日宏量营养素
  const todayMacros = useMemo(() => {
    return history.reduce((acc, meal) => {
      if (meal.macros) {
        return {
          protein: acc.protein + (meal.macros.protein || 0),
          carbs: acc.carbs + (meal.macros.carbs || 0),
          fat: acc.fat + (meal.macros.fat || 0),
        };
      }
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });
  }, [history]);

  // 计算宏量比例
  const macroRatios = useMemo(() => {
    const total = todayMacros.protein + todayMacros.carbs + todayMacros.fat;
    if (total === 0) return { protein: 33, carbs: 34, fat: 33 };
    return {
      protein: Math.round((todayMacros.protein / total) * 100),
      carbs: Math.round((todayMacros.carbs / total) * 100),
      fat: Math.round((todayMacros.fat / total) * 100),
    };
  }, [todayMacros]);

  // 生成周数据（今天 + 之前 6 天的模拟数据）
  const weeklyData = useMemo(() => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const today = new Date();
    const todayIndex = today.getDay();
    
    return days.map((dayName, i) => {
      if (i === todayIndex) {
        // 今天使用真实数据
        return { day: dayName, cal: todayCalories, max: userProfile.dailyCalories, isToday: true };
      }
      // 其他天使用模拟数据
      const mockCal = Math.floor(1500 + Math.random() * 800);
      return { day: dayName, cal: mockCal, max: userProfile.dailyCalories, isToday: false };
    });
  }, [todayCalories, userProfile.dailyCalories]);

  const maxVal = Math.max(...weeklyData.map(d => d.cal), userProfile.dailyCalories);
  const avgCalories = Math.round(weeklyData.reduce((s, d) => s + d.cal, 0) / 7);
  
  // 蛋白质目标进度
  const proteinTarget = 150;
  const proteinProgress = Math.min(Math.round((todayMacros.protein / proteinTarget) * 100), 100);

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
        
        {/* 1. 热量趋势柱状图 */}
        <section className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col h-[280px]">
            <div className="flex items-start justify-between mb-8 shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">热量摄入</h2>
                    <p className="text-xs text-gray-400 font-medium mt-1">平均每日 {avgCalories.toLocaleString()} 千卡</p>
                </div>
                <div className="size-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                    <span className="material-symbols-outlined">local_fire_department</span>
                </div>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-3 px-2">
                {weeklyData.map((d: any, i) => {
                    const isOver = d.cal > d.max;
                    const heightPercent = Math.max(10, Math.min((d.cal / (maxVal * 1.1)) * 100, 100));
                    
                    return (
                        <div key={i} className="flex flex-col items-center gap-3 flex-1 group cursor-pointer h-full justify-end">
                            <div className="relative w-full flex items-end justify-center h-[85%]">
                                {/* Tooltip */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] py-1 px-2 rounded-lg font-bold whitespace-nowrap z-10 shadow-lg pointer-events-none">
                                    {d.cal} 千卡{d.isToday && ' (今天)'}
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                </div>
                                {/* Bar - 今天用不同颜色 */}
                                <div 
                                    className={`w-full max-w-[14px] rounded-full transition-all duration-700 ease-out ${
                                        d.isToday 
                                            ? (isOver ? 'bg-orange-500' : 'bg-primary ring-2 ring-primary/30') 
                                            : (isOver ? 'bg-orange-300' : 'bg-primary/60')
                                    }`}
                                    style={{ height: `${heightPercent}%` }}
                                ></div>
                                <div className="absolute bottom-0 w-full max-w-[14px] h-full bg-gray-50 rounded-full -z-10"></div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase h-[15%] flex items-start ${d.isToday ? 'text-primary' : 'text-gray-300'}`}>
                                {d.day.replace('周', '')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>

        {/* 2. 营养均衡度分析 */}
        <section className="grid grid-cols-2 gap-4">
            <div className="bg-primary text-white p-5 rounded-[2rem] shadow-fab flex flex-col justify-between relative overflow-hidden h-[180px]">
                <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="relative z-10 mt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span className="text-xs font-bold opacity-80">今日表现</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight tracking-tight">
                        蛋白质摄入<br/>{proteinProgress >= 80 ? '完美达标' : proteinProgress >= 50 ? '进度良好' : '继续加油'}
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
                            {/* Background */}
                            <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                            {/* Fat - 根据比例绘制 */}
                            <path className="text-accent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeDasharray={`${macroRatios.fat}, 100`} />
                            {/* Protein */}
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

        {/* 3. 体重趋势 SVG 线图 */}
        <section className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-50 mb-6 h-[260px] flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-lg font-bold text-gray-800">体重变化</h2>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-green-50 rounded-lg">
                    <span className="material-symbols-outlined text-green-600 text-sm">trending_down</span>
                    <span className="text-xs font-bold text-green-600">-2.4kg</span>
                </div>
            </div>
            
            <div className="relative flex-1 w-full">
                {/* Y-Axis Labels & Grid Lines - Separated for cleaner look */}
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-300 font-bold pointer-events-none pb-6">
                    <div className="flex items-center gap-2">
                        <span className="w-8 text-right">75kg</span>
                        <div className="h-px bg-gray-50 flex-1 border-b border-dashed border-gray-100"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 text-right">70kg</span>
                        <div className="h-px bg-gray-50 flex-1 border-b border-dashed border-gray-100"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 text-right">65kg</span>
                        <div className="h-px bg-gray-50 flex-1 border-b border-dashed border-gray-100"></div>
                    </div>
                </div>

                {/* SVG Curve - Added ViewBox for correct scaling */}
                <div className="absolute inset-0 left-10 right-0 bottom-6 top-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#8daa9d" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#8daa9d" stopOpacity="0" />
                            </linearGradient>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#8daa9d" floodOpacity="0.2"/>
                            </filter>
                        </defs>
                        
                        {/* Area under curve */}
                        <path 
                            d="M0,20 C50,20 100,60 150,50 C200,40 250,80 300,90 L300,120 L0,120 Z" 
                            fill="url(#gradientArea)" 
                        />
                        
                        {/* The Line */}
                        <path 
                            d="M0,20 C50,20 100,60 150,50 C200,40 250,80 300,90" 
                            fill="none" 
                            stroke="#8daa9d" 
                            strokeWidth="3" 
                            strokeLinecap="round"
                            filter="url(#shadow)"
                        />
                        
                        {/* Data Points */}
                        <circle cx="0" cy="20" r="4" fill="white" stroke="#8daa9d" strokeWidth="2.5" />
                        <circle cx="150" cy="50" r="4" fill="white" stroke="#8daa9d" strokeWidth="2.5" />
                        <circle cx="300" cy="90" r="4" fill="white" stroke="#8daa9d" strokeWidth="2.5" />
                    </svg>
                </div>

                {/* X-Axis Labels */}
                <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[10px] font-bold text-gray-300 uppercase transform translate-y-2">
                    <span>3月1日</span>
                    <span>3月15日</span>
                    <span>3月30日</span>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default StatsView;
