
import React from 'react';
import { Meal } from '../types';

interface MealDetailViewProps {
  meal: Meal;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const MealDetailView: React.FC<MealDetailViewProps> = ({ meal, onDelete, onBack }) => {
  // Fallback macros if not present in data
  const macros = meal.macros || {
    protein: Math.round(meal.kcal * 0.3 / 4),
    carbs: Math.round(meal.kcal * 0.4 / 4),
    fat: Math.round(meal.kcal * 0.3 / 9),
  };

  const confirmDelete = () => {
    if (window.confirm('确定要删除这条饮食记录吗？')) {
        onDelete(meal.id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto no-scrollbar animate-slide-in-right relative">
      {/* 图片区域 */}
      <div className="relative h-[45vh] shrink-0 w-full">
        {/* 操作栏叠加在图片上方 */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4">
          {/* 返回按钮 */}
          <button 
              onClick={onBack} 
              className="size-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors active:scale-95"
          >
              <span className="material-symbols-outlined">arrow_back</span>
          </button>

          {/* 删除按钮 */}
          <button 
              onClick={confirmDelete} 
              className="size-11 rounded-full bg-red-500 shadow-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors active:scale-95"
          >
              <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
         <img src={meal.image || 'https://picsum.photos/400'} className="w-full h-full object-cover" alt={meal.name} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-10 left-6 right-6 z-10">
            <div className="flex items-center gap-3 mb-3">
                 <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-sm">
                    {meal.type}
                 </span>
                 <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-sm border border-white/10">
                    {meal.time}
                 </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight shadow-sm tracking-wide">{meal.name}</h1>
        </div>
      </div>

      <div className="px-6 py-10 -mt-8 bg-white rounded-t-[2.5rem] relative z-20 flex-1 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
         
         <div className="flex justify-center mb-10">
            <div className="flex flex-col items-center">
                <span className="text-6xl font-black text-primary tracking-tighter drop-shadow-sm">{meal.kcal}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">总热量 (千卡)</span>
            </div>
         </div>

         <div className="bg-[#f8f9fa] rounded-[2rem] p-6 mb-8 border border-gray-50">
             <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="font-bold text-gray-800 text-lg">营养构成</h3>
                <span className="material-symbols-outlined text-gray-300">pie_chart</span>
             </div>
             
             <div className="space-y-5">
                <MacroRow label="蛋白质" val={`${macros.protein}克`} color="bg-primary" pct="35%" />
                <MacroRow label="碳水化合物" val={`${macros.carbs}克`} color="bg-accent" pct="45%" />
                <MacroRow label="脂肪" val={`${macros.fat}克`} color="bg-gray-400" pct="20%" />
             </div>
         </div>

         <div className="space-y-4">
             <h3 className="font-bold text-gray-800 px-2 text-lg">AI 营养点评</h3>
             <div className="bg-[#f0fdf4] p-5 rounded-[1.5rem] border border-green-100 flex gap-4">
                <div className="size-10 rounded-full bg-white text-green-600 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined">eco</span>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-1">健康选择</h4>
                    <p className="text-sm text-gray-600 leading-relaxed text-justify">这顿餐食的蛋白质含量很不错，有助于肌肉修复。如果你在控制体重，建议稍微减少碳水化合物的摄入。</p>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

const MacroRow = ({ label, val, color, pct }: any) => (
    <div className="flex items-center gap-4">
        <div className={`size-3 rounded-full ${color} shrink-0`}></div>
        <span className="flex-1 text-sm font-bold text-gray-600">{label}</span>
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shrink-0">
            <div className={`h-full ${color}`} style={{ width: pct }}></div>
        </div>
        <span className="text-sm font-black text-gray-800 w-12 text-right">{val}</span>
    </div>
);

export default MealDetailView;
