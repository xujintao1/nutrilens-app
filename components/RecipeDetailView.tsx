
import React from 'react';
import { Recipe } from '../types';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onAdd: (recipe: Recipe) => void;
  onBack: () => void;
}

const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, onAdd, onBack }) => {
  return (
    <div className="h-full bg-white flex flex-col animate-slide-up overflow-y-auto no-scrollbar pb-10">
      <div className="relative h-72 shrink-0">
        <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button 
            onClick={onBack} 
            className="absolute top-6 left-6 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg mb-2 shadow-sm">
                {recipe.cal}
              </div>
            <h1 className="text-2xl font-extrabold text-white leading-tight shadow-sm">{recipe.title}</h1>
        </div>
      </div>

      <div className="px-6 py-8 -mt-6 bg-white rounded-t-[2rem] relative z-10 flex-1">
        <p className="text-gray-500 leading-relaxed mb-8 font-medium">{recipe.desc}</p>
        
        <div className="mb-8">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">grocery</span>
                准备食材
            </h3>
            <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="size-2 rounded-full bg-accent"></div>
                        <span className="font-medium">{ing}</span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="mb-20">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">cooking</span>
                制作步骤
            </h3>
            <div className="space-y-6">
                {recipe.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="flex-none size-8 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-sm shadow-sm mt-0.5">
                            {i+1}
                        </div>
                        <p className="text-gray-600 leading-relaxed pt-1 font-medium">{step}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* 悬浮操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 z-30">
            <button 
            onClick={() => onAdd(recipe)}
            className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-glow flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
            <span className="material-symbols-outlined">add_circle</span>
            加入今日饮食记录
        </button>
      </div>
    </div>
  );
};

export default RecipeDetailView;
