
import React, { useMemo } from 'react';
import { Meal } from '../types';

interface HistoryViewProps {
  history: Meal[];
  onBack: () => void;
  onMealSelect: (meal: Meal) => void;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays === 2) return '前天';
  if (diffDays < 7) return `${diffDays}天前`;
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });
}

function getDateKey(dateStr?: string): string {
  if (!dateStr) return 'unknown';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack, onMealSelect }) => {
  const groupedHistory = useMemo(() => {
    const groups: Record<string, Meal[]> = {};
    history.forEach(meal => {
      const key = getDateKey(meal.created_at);
      if (!groups[key]) groups[key] = [];
      groups[key].push(meal);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [history]);

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekMeals = history.filter(m => m.created_at && new Date(m.created_at) >= weekAgo);
    const totalCal = weekMeals.reduce((s, m) => s + m.kcal, 0);
    const avgCal = weekMeals.length > 0 ? Math.round(totalCal / weekMeals.length) : 0;
    return { weekCount: weekMeals.length, avgCal };
  }, [history]);

  return (
    <div className="h-full flex flex-col bg-[#F9FBFA] animate-slide-in-right overflow-y-auto no-scrollbar">
      <header className="flex items-center px-6 py-5 sticky top-0 bg-[#F9FBFA]/90 backdrop-blur-md z-20">
        <button onClick={onBack} className="size-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-gray-800">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-10">历史记录</h1>
      </header>

      <div className="px-6 py-4 space-y-6 pb-32">
        <div className="bg-primary text-white p-6 rounded-[2rem] shadow-fab flex items-center justify-between">
            <div>
                <p className="text-white/80 text-xs font-bold uppercase mb-1">本周记录</p>
                <h2 className="text-3xl font-extrabold">{stats.weekCount} <span className="text-lg font-medium opacity-80">餐</span></h2>
            </div>
            <div className="h-12 w-[1px] bg-white/20"></div>
            <div>
                 <p className="text-white/80 text-xs font-bold uppercase mb-1">平均热量</p>
                 <h2 className="text-3xl font-extrabold">{stats.avgCal} <span className="text-lg font-medium opacity-80">kcal</span></h2>
            </div>
        </div>

        {groupedHistory.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-gray-200 mb-3">history</span>
            <p className="text-gray-400 text-sm">暂无饮食记录</p>
          </div>
        ) : (
          groupedHistory.map(([dateKey, meals]) => {
            const dayCalories = meals.reduce((s, m) => s + m.kcal, 0);
            return (
              <div key={dateKey}>
                <div className="flex items-center justify-between mb-4 ml-2">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{formatDateLabel(dateKey)}</h3>
                  <span className="text-[10px] font-bold text-gray-300">{dayCalories} kcal · {meals.length}餐</span>
                </div>
                <div className="space-y-3">
                  {meals.map(meal => (
                    <HistoryItem key={meal.id} meal={meal} onClick={() => onMealSelect(meal)} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const HistoryItem: React.FC<{ meal: Meal; onClick?: () => void }> = ({ meal, onClick }) => (
    <div onClick={onClick} className="bg-white p-3 pr-5 rounded-2xl shadow-soft border border-gray-50 flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-transform">
        <div className="size-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
            <img src={meal.image || 'https://picsum.photos/200'} className="w-full h-full object-cover" alt={meal.name} />
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-gray-800">{meal.name}</h4>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{meal.type}</span>
                <span className="text-xs font-medium text-gray-400">{meal.time}</span>
            </div>
        </div>
        <div className="text-right">
             <span className="block font-black text-gray-800 text-lg">{meal.kcal}</span>
             <span className="text-[10px] font-bold text-gray-400 uppercase">kcal</span>
        </div>
    </div>
);

export default HistoryView;
