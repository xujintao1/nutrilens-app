
import React from 'react';
import { Meal } from '../types';

interface HistoryViewProps {
  history: Meal[];
  onBack: () => void;
  onMealSelect: (meal: Meal) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack, onMealSelect }) => {
  return (
    <div className="h-full flex flex-col bg-[#F9FBFA] animate-slide-in-right overflow-y-auto no-scrollbar">
      <header className="flex items-center px-6 py-5 sticky top-0 bg-[#F9FBFA]/90 backdrop-blur-md z-20">
        <button onClick={onBack} className="size-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-gray-800">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-10">历史记录</h1>
      </header>

      <div className="px-6 py-4 space-y-6 pb-32">
        {/* Statistics Summary */}
        <div className="bg-primary text-white p-6 rounded-[2rem] shadow-fab flex items-center justify-between">
            <div>
                <p className="text-white/80 text-xs font-bold uppercase mb-1">本周记录</p>
                <h2 className="text-3xl font-extrabold">{history.length + 12} <span className="text-lg font-medium opacity-80">餐</span></h2>
            </div>
            <div className="h-12 w-[1px] bg-white/20"></div>
            <div>
                 <p className="text-white/80 text-xs font-bold uppercase mb-1">平均热量</p>
                 <h2 className="text-3xl font-extrabold">450 <span className="text-lg font-medium opacity-80">kcal</span></h2>
            </div>
        </div>

        {/* Timeline */}
        <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 ml-2">今天</h3>
            <div className="space-y-3">
                {history.map(meal => (
                    <HistoryItem key={meal.id} meal={meal} onClick={() => onMealSelect(meal)} />
                ))}
            </div>
        </div>

        {/* Mock Yesterday Data - Not interactive for now as they are static */}
        <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 ml-2">昨天</h3>
            <div className="space-y-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <HistoryItem meal={{ id: 'old1', name: '全麦三明治', type: '早餐', time: '08:15', kcal: 320, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&h=200' }} onClick={() => alert('这是历史演示数据，无法查看详情')} />
                <HistoryItem meal={{ id: 'old2', name: '牛肉波奇饭', type: '午餐', time: '12:30', kcal: 550, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&h=200' }} onClick={() => alert('这是历史演示数据，无法查看详情')} />
                <HistoryItem meal={{ id: 'old3', name: '希腊酸奶', type: '加餐', time: '16:00', kcal: 120, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=200&h=200' }} onClick={() => alert('这是历史演示数据，无法查看详情')} />
            </div>
        </div>
      </div>
    </div>
  );
};

const HistoryItem: React.FC<{ meal: any; onClick?: () => void }> = ({ meal, onClick }) => (
    <div onClick={onClick} className="bg-white p-3 pr-5 rounded-2xl shadow-soft border border-gray-50 flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-transform">
        <div className="size-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
            <img src={meal.image} className="w-full h-full object-cover" alt={meal.name} />
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
