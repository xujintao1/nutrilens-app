
import React, { useEffect, useState } from 'react';
import { NutritionData } from '../types';
import { analyzeFoodImage } from '../geminiService';

interface ResultViewProps {
  image: string;
  onAdd: (data: NutritionData) => void;
  onBack: () => void;
}

// 模拟数据，防止API失败导致页面无法显示
const MOCK_DATA: NutritionData = {
    foodName: "演示用-香煎鸡胸肉",
    description: "由于AI连接失败，这是显示的演示数据。看起来这是一份健康的鸡肉沙拉。",
    calories: 420,
    macros: {
        protein: 35,
        carbs: 12,
        fat: 18
    },
    highlights: {
        fiber: "高蛋白",
        energy: "低碳水"
    }
};

const ResultView: React.FC<ResultViewProps> = ({ image, onAdd, onBack }) => {
  const [data, setData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<NutritionData | null>(null);

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const result = await analyzeFoodImage(image);
        setData(result);
        setEditForm(result);
      } catch (err) {
        console.error("Analysis failed, using mock data for UI demo:", err);
        // CRITICAL FIX: 不要直接 onBack()，而是加载模拟数据，确保用户能看到结果页
        setData(MOCK_DATA);
        setEditForm(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };
    runAnalysis();
  }, [image]);

  const handleSaveEdit = () => {
    if (editForm) {
      setData(editForm);
      setIsEditing(false);
    }
  };

  const updateEditField = (field: keyof NutritionData, value: any) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  };

  const updateMacroField = (field: keyof typeof editForm.macros, value: string) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      macros: {
        ...editForm.macros,
        [field]: Number(value) || 0
      }
    });
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white p-8">
        <div className="relative size-32 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">正在分析食物...</h2>
        <p className="text-gray-400 text-center mt-2">AI 正在识别热量与营养成分</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto no-scrollbar pb-36 relative">
      <header className="flex items-center justify-between px-6 py-5 sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <button onClick={onBack} className="size-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-gray-800">arrow_back</span>
        </button>
        <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400">分析结果</h2>
        {/* Header Edit Button */}
        <button 
            onClick={() => setIsEditing(true)}
            className="h-9 px-4 rounded-full bg-gray-100 text-gray-800 font-bold text-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          编辑
        </button>
      </header>

      <div className="px-6 py-2">
        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-soft group">
          <img src={`data:image/jpeg;base64,${image}`} className="w-full h-full object-cover" alt="Captured food" />
          <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
            <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
            <span className="text-xs font-bold text-gray-800">AI 分析结果</span>
          </div>
          {/* Image Floating Edit Button */}
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute bottom-4 right-4 size-11 rounded-full bg-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-gray-800 text-[20px]">edit</span>
          </button>
        </div>
      </div>

      <div className="px-6 flex flex-col items-center text-center mt-6">
        <div 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors group"
        >
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight group-hover:text-primary transition-colors">{data.foodName}</h1>
            <span className="material-symbols-outlined text-gray-300 text-[24px] group-hover:text-primary transition-colors">edit_square</span>
        </div>
        <p className="text-gray-400 text-sm font-medium mt-1">{data.description}</p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-[64px] font-black text-primary leading-none tracking-tighter">{data.calories}</span>
          <span className="text-2xl font-bold text-primary/60">千卡</span>
        </div>
      </div>

      <div className="mt-8 px-4">
        <div className="bg-background-light rounded-[2.5rem] p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-gray-800">营养成分分布</h3>
              <button onClick={() => alert('每日目标：热量 2000 千卡\n蛋白质：150克\n碳水：250克\n脂肪：70克')} className="text-xs font-semibold text-primary bg-white px-3 py-1 rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors">每日目标</button>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative size-36 shrink-0">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 36 36">
                  <path className="text-white" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path className="text-accent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="45, 100" strokeLinecap="round" strokeWidth="4" />
                  <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-45" strokeLinecap="round" strokeWidth="4" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">总计</span>
                  <span className="text-sm font-black text-gray-800">100%</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <LegendRow color="bg-primary" label="蛋白质" val={`${data.macros.protein}克`} />
                <LegendRow color="bg-accent" label="碳水" val={`${data.macros.carbs}克`} />
                <LegendRow color="bg-gray-300" label="脂肪" val={`${data.macros.fat}克`} />
              </div>
            </div>

            <div className="h-px w-full bg-gray-200"></div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">营养亮点</h4>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                <HighlightBadge icon="eco" label="纤维" val={data.highlights.fiber} />
                <HighlightBadge icon="bolt" label="能量" val={data.highlights.energy} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-100 px-6 py-4 pb-8 z-30">
        <div className="flex gap-3">
            <button onClick={() => setIsEditing(true)} className="flex-none w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined">edit</span>
            </button>
            <button onClick={() => onAdd(data)} className="flex-1 h-16 bg-primary text-white font-bold text-lg rounded-2xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                <span>加入今日记录</span>
            </button>
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {isEditing && editForm && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-t-[1.5rem] animate-slide-up shadow-2xl h-[90%] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
              <button onClick={() => setIsEditing(false)} className="text-gray-500 font-medium px-4 py-2">取消</button>
              <h3 className="text-lg font-bold text-gray-800">编辑信息</h3>
              <button onClick={handleSaveEdit} className="text-primary font-bold px-4 py-2">保存</button>
            </div>
            
            {/* Modal Content - List Style Form */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-background-light p-4 space-y-6">
              
              {/* Section 1: Basic Info */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <FormRow label="名称">
                    <input 
                      type="text" 
                      value={editForm.foodName}
                      onChange={(e) => updateEditField('foodName', e.target.value)}
                      className="w-full text-right bg-transparent border-none focus:ring-0 p-0 text-gray-800 font-medium"
                      placeholder="食物名称"
                    />
                </FormRow>
                <div className="h-px bg-gray-50 mx-4"></div>
                <FormRow label="描述">
                    <input 
                      type="text" 
                      value={editForm.description}
                      onChange={(e) => updateEditField('description', e.target.value)}
                      className="w-full text-right bg-transparent border-none focus:ring-0 p-0 text-gray-500 text-sm"
                      placeholder="简短描述"
                    />
                </FormRow>
              </div>

              {/* Section 2: Energy */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <FormRow label="总热量 (千卡)">
                    <input 
                      type="number" 
                      value={editForm.calories}
                      onChange={(e) => updateEditField('calories', Number(e.target.value))}
                      className="w-full text-right bg-transparent border-none focus:ring-0 p-0 text-primary font-bold text-xl"
                    />
                </FormRow>
              </div>

              {/* Section 3: Macros */}
              <div className="space-y-2">
                <h4 className="ml-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">营养素含量 (克)</h4>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <FormRow label="蛋白质">
                        <input 
                        type="number" 
                        value={editForm.macros.protein} 
                        onChange={(e) => updateMacroField('protein', e.target.value)}
                        className="w-24 text-right bg-transparent border-none focus:ring-0 p-0 text-gray-800 font-semibold"
                        />
                    </FormRow>
                    <div className="h-px bg-gray-50 mx-4"></div>
                    <FormRow label="碳水化合物">
                        <input 
                        type="number" 
                        value={editForm.macros.carbs} 
                        onChange={(e) => updateMacroField('carbs', e.target.value)}
                        className="w-24 text-right bg-transparent border-none focus:ring-0 p-0 text-gray-800 font-semibold"
                        />
                    </FormRow>
                    <div className="h-px bg-gray-50 mx-4"></div>
                    <FormRow label="脂肪">
                        <input 
                        type="number" 
                        value={editForm.macros.fat} 
                        onChange={(e) => updateMacroField('fat', e.target.value)}
                        className="w-24 text-right bg-transparent border-none focus:ring-0 p-0 text-gray-800 font-semibold"
                        />
                    </FormRow>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for standard list items
const FormRow = ({ label, children }: { label: string, children?: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 h-14">
        <span className="text-gray-800 font-medium text-[15px]">{label}</span>
        <div className="flex-1 ml-4">
            {children}
        </div>
    </div>
);

const LegendRow = ({ color, label, val }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`size-2.5 rounded-full ${color}`}></div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-800">{val}</span>
  </div>
);

const HighlightBadge = ({ icon, label, val }: any) => (
  <div className="flex-none bg-white p-3 pr-5 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100">
    <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center text-primary">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <div className="text-[10px] font-bold uppercase text-gray-400">{label}</div>
      <div className="text-sm font-bold text-gray-800">{val}</div>
    </div>
  </div>
);

export default ResultView;
