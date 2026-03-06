
import React from 'react';
import { Meal } from '../types';

interface MealDetailViewProps {
  meal: Meal;
  onDelete: (id: string) => void;
  onBack: () => void;
}

function getAiComment(meal: Meal): { title: string; body: string; icon: string; bgColor: string; iconColor: string } {
  const macros = meal.macros || { protein: 0, carbs: 0, fat: 0 };
  const total = macros.protein + macros.carbs + macros.fat;
  const proteinRatio = total > 0 ? macros.protein / total : 0;
  const carbsRatio = total > 0 ? macros.carbs / total : 0;
  const fatRatio = total > 0 ? macros.fat / total : 0;

  if (meal.kcal > 800) {
    return {
      title: '高热量餐食',
      body: `这顿餐食热量较高(${meal.kcal}千卡)，建议搭配适量运动消耗多余热量。如果在减脂期，可以考虑减少份量或选择低热量替代食材。`,
      icon: 'warning', bgColor: 'bg-orange-50 border-orange-100', iconColor: 'text-orange-500'
    };
  }
  if (proteinRatio >= 0.35) {
    return {
      title: '高蛋白优质餐',
      body: `这顿餐食蛋白质占比${Math.round(proteinRatio * 100)}%，非常适合增肌期食用。优质蛋白有助于肌肉合成与修复，继续保持!`,
      icon: 'fitness_center', bgColor: 'bg-blue-50 border-blue-100', iconColor: 'text-blue-500'
    };
  }
  if (fatRatio >= 0.4) {
    return {
      title: '注意脂肪摄入',
      body: `这顿餐食脂肪含量较高(占比${Math.round(fatRatio * 100)}%)，建议减少油炸食品摄入，选择蒸煮等低脂烹饪方式。`,
      icon: 'info', bgColor: 'bg-yellow-50 border-yellow-100', iconColor: 'text-yellow-600'
    };
  }
  if (carbsRatio >= 0.6) {
    return {
      title: '碳水偏高提醒',
      body: `碳水化合物占比${Math.round(carbsRatio * 100)}%，建议适当增加蛋白质和蔬菜摄入以获得更均衡的营养搭配。`,
      icon: 'tips_and_updates', bgColor: 'bg-amber-50 border-amber-100', iconColor: 'text-amber-600'
    };
  }
  if (meal.kcal <= 300) {
    return {
      title: '清淡低卡',
      body: '这是一顿轻食餐，热量控制得很好!适合减脂期间食用。注意全天营养均衡，不要为了控制热量而忽略必要营养素。',
      icon: 'spa', bgColor: 'bg-green-50 border-green-100', iconColor: 'text-green-600'
    };
  }
  return {
    title: '健康选择',
    body: '这顿餐食的营养搭配比较均衡，热量也在合理范围内。继续保持良好的饮食习惯，注意多样化食材选择。',
    icon: 'eco', bgColor: 'bg-[#f0fdf4] border-green-100', iconColor: 'text-green-600'
  };
}

const MealDetailView: React.FC<MealDetailViewProps> = ({ meal, onDelete, onBack }) => {
  const macros = meal.macros || {
    protein: Math.round(meal.kcal * 0.3 / 4),
    carbs: Math.round(meal.kcal * 0.4 / 4),
    fat: Math.round(meal.kcal * 0.3 / 9),
  };

  const totalMacroGrams = macros.protein + macros.carbs + macros.fat;
  const proteinPct = totalMacroGrams > 0 ? Math.round((macros.protein / totalMacroGrams) * 100) : 33;
  const carbsPct = totalMacroGrams > 0 ? Math.round((macros.carbs / totalMacroGrams) * 100) : 34;
  const fatPct = totalMacroGrams > 0 ? Math.round((macros.fat / totalMacroGrams) * 100) : 33;

  const aiComment = getAiComment(meal);

  const confirmDelete = () => {
    if (window.confirm('确定要删除这条饮食记录吗？')) {
        onDelete(meal.id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto no-scrollbar animate-slide-in-right relative">
      <div className="relative h-[45vh] shrink-0 w-full">
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4">
          <button 
              onClick={onBack} 
              className="size-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors active:scale-95"
          >
              <span className="material-symbols-outlined">arrow_back</span>
          </button>
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
                <MacroRow label="蛋白质" val={`${macros.protein}克`} color="bg-primary" pct={`${proteinPct}%`} />
                <MacroRow label="碳水化合物" val={`${macros.carbs}克`} color="bg-accent" pct={`${carbsPct}%`} />
                <MacroRow label="脂肪" val={`${macros.fat}克`} color="bg-gray-400" pct={`${fatPct}%`} />
             </div>
         </div>

         <div className="space-y-4">
             <h3 className="font-bold text-gray-800 px-2 text-lg">AI 营养点评</h3>
             <div className={`p-5 rounded-[1.5rem] border flex gap-4 ${aiComment.bgColor}`}>
                <div className={`size-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm ${aiComment.iconColor}`}>
                    <span className="material-symbols-outlined">{aiComment.icon}</span>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-1">{aiComment.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed text-justify">{aiComment.body}</p>
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
            <div className={`h-full ${color} transition-all duration-500`} style={{ width: pct }}></div>
        </div>
        <span className="text-sm font-black text-gray-800 w-12 text-right">{val}</span>
    </div>
);

export default MealDetailView;
