
import React, { useState } from 'react';

interface GoalsViewProps {
  userProfile: {
      weight: number;
      goalWeight: number;
      dailyCalories: number;
  };
  onUpdate: (data: any) => void;
  onBack: () => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ userProfile, onUpdate, onBack }) => {
  const [weight, setWeight] = useState(userProfile.weight);
  const [goalWeight, setGoalWeight] = useState(userProfile.goalWeight);
  const [calories, setCalories] = useState(userProfile.dailyCalories);

  const handleSave = () => {
    onUpdate({ weight, goalWeight, dailyCalories: calories });
    onBack();
  };

  const diff = weight - goalWeight;
  const isLoss = diff > 0;
  const absDiff = Math.abs(diff).toFixed(1);
  const isDone = Math.abs(diff) < 0.1;

  return (
    <div className="h-full flex flex-col bg-[#F9FBFA] animate-slide-in-right overflow-y-auto no-scrollbar">
      <header className="flex items-center px-6 py-5 sticky top-0 bg-[#F9FBFA]/90 backdrop-blur-md z-20">
        <button onClick={onBack} className="size-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-gray-800">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-10">我的目标</h1>
      </header>

      <div className="px-6 py-4 space-y-8">
        
        {/* Weight Section */}
        <section className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-50">
            <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">monitor_weight</span>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">体重目标</h3>
                    <p className="text-xs text-gray-400">设定你的理想体重</p>
                </div>
            </div>

            <div className="flex items-end justify-between mb-8 px-2">
                <div className="text-center group w-24">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1 transition-colors group-hover:text-primary">当前</p>
                    <p className="text-2xl font-black text-gray-800 transition-all duration-300">{weight.toFixed(1)} <span className="text-sm text-gray-400 font-medium">kg</span></p>
                </div>
                
                <div className="h-0.5 bg-gray-100 flex-1 mx-2 mb-3 relative rounded-full">
                    <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-sm border border-white/50 transition-all duration-500 ease-out transform ${
                        isDone 
                        ? 'bg-green-500 text-white scale-110 shadow-green-200' 
                        : 'bg-white text-primary shadow-sm'
                    }`}>
                        {isDone ? '目标达成 🎉' : `${isLoss ? '需减' : '需增'} ${absDiff} kg`}
                    </span>
                </div>

                <div className="text-center group w-24">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1 transition-colors group-hover:text-primary">目标</p>
                    <p className="text-2xl font-black text-primary transition-all duration-300">{goalWeight.toFixed(1)} <span className="text-sm text-primary/60 font-medium">kg</span></p>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="flex justify-between text-sm font-bold text-gray-700 mb-3">
                        调整当前体重
                        <span className="text-primary">{weight.toFixed(1)} kg</span>
                    </label>
                    <input 
                        type="range" 
                        min="40" 
                        max="120" 
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                        className="w-full accent-gray-800 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer hover:bg-gray-200 transition-colors"
                    />
                </div>
                <div>
                    <label className="flex justify-between text-sm font-bold text-gray-700 mb-3">
                        调整目标体重
                        <span className="text-primary">{goalWeight.toFixed(1)} kg</span>
                    </label>
                    <input 
                        type="range" 
                        min="40" 
                        max="100" 
                        step="0.1"
                        value={goalWeight}
                        onChange={(e) => setGoalWeight(parseFloat(e.target.value))}
                        className="w-full accent-primary h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer hover:bg-gray-200 transition-colors"
                    />
                </div>
            </div>
        </section>

        {/* Calories Section */}
        <section className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-50">
            <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                    <span className="material-symbols-outlined">local_fire_department</span>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">每日热量预算</h3>
                    <p className="text-xs text-gray-400">基于你的活动量推荐</p>
                </div>
            </div>

            <div className="text-center mb-6">
                <span className="text-5xl font-black text-gray-800 tracking-tighter transition-all duration-300">{calories}</span>
                <p className="text-sm font-bold text-gray-400 uppercase mt-1">KCAL / 天</p>
            </div>

            <div className="flex gap-2">
                {[1800, 2000, 2200].map(c => (
                    <button 
                        key={c}
                        onClick={() => setCalories(c)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${calories === c ? 'bg-gray-800 text-white shadow-md scale-105' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </section>

        <button onClick={handleSave} className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-glow active:scale-[0.98] transition-transform">
            保存更改
        </button>
      </div>
    </div>
  );
};

export default GoalsView;
