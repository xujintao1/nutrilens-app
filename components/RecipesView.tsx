
import React from 'react';
import { Recipe } from '../types';

interface RecipesViewProps {
    onRecipeSelect?: (recipe: Recipe) => void;
}

const RecipesView: React.FC<RecipesViewProps> = ({ onRecipeSelect }) => {
  const recipes: Recipe[] = [
    {
      id: 1,
      title: '低卡减脂餐 #1',
      desc: '采用新鲜的三文鱼和藜麦，富含优质蛋白和复合碳水，适合减脂期食用。',
      cal: '350千卡',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      ingredients: ['三文鱼 150g', '三色藜麦 50g', '西兰花 100g', '小番茄 5个', '柠檬 1个'],
      steps: ['藜麦洗净，加水煮15分钟至熟透。', '三文鱼抹上海盐和黑胡椒腌制10分钟。', '平底锅喷少许橄榄油，将三文鱼煎至两面金黄。', '西兰花焯水煮熟。', '所有食材装盘，淋上柠檬汁即可。']
    },
    {
      id: 2,
      title: '低卡减脂餐 #2',
      desc: '经典的鸡胸肉沙拉，搭配特调低脂油醋汁，清爽不油腻，饱腹感强。',
      cal: '320千卡',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
      ingredients: ['鸡胸肉 200g', '混合生菜 100g', '黄瓜 半根', '特调油醋汁 20ml', '玉米粒 30g'],
      steps: ['鸡胸肉煮熟撕成丝，或者煎熟切块。', '生菜洗净沥干，铺在碗底。', '放上黄瓜片、玉米粒和鸡肉。', '食用前淋上油醋汁搅拌均匀。']
    },
    {
      id: 3,
      title: '低卡减脂餐 #3',
      desc: '牛油果全麦吐司配水波蛋，富含健康脂肪，开启活力满满的一天。',
      cal: '380千卡',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      ingredients: ['熟透牛油果 半个', '全麦吐司 2片', '无菌鸡蛋 1个', '黑胡椒碎 适量', '海盐 少许'],
      steps: ['全麦吐司放入烤面包机烤至酥脆。', '牛油果去皮去核，捣成泥状。', '锅中水烧开转小火，打入鸡蛋煮3分钟做成水波蛋。', '将牛油果泥涂抹在吐司上，放上鸡蛋，撒调料。']
    },
    {
      id: 4,
      title: '低卡减脂餐 #4',
      desc: '色彩丰富的素食碗，提供丰富的膳食纤维和维生素。',
      cal: '400千卡',
      image: 'https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=600&q=80',
      ingredients: ['鹰嘴豆 100g', '红薯 1个', '羽衣甘蓝 50g', '牛油果 1/4个', '坚果碎 少许'],
      steps: ['红薯切块蒸熟。', '鹰嘴豆煮熟或使用罐头沥干。', '羽衣甘蓝切碎，加少许盐抓匀。', '将所有食材混合，撒上坚果碎增加口感。']
    }
  ];

  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] overflow-y-auto no-scrollbar pb-32">
      <header className="px-6 pt-10 pb-2 sticky top-0 z-20 bg-[#fcfcfc]/90 backdrop-blur-md">
        <h1 className="text-[22px] font-extrabold tracking-tight text-gray-800">健康食谱</h1>
      </header>
      
      <div className="px-5 grid gap-4 mt-2">
        {recipes.map((recipe) => (
            <div 
                key={recipe.id} 
                onClick={() => onRecipeSelect?.(recipe)}
                className="bg-white p-3 rounded-[20px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-50 flex gap-4 items-center active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md"
            >
                <div className="size-[90px] rounded-[16px] bg-gray-100 shrink-0 overflow-hidden shadow-inner">
                    <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.title} />
                </div>
                <div className="flex flex-col justify-center gap-1.5 flex-1 pr-2">
                    <h3 className="font-bold text-gray-800 text-[17px] leading-tight">{recipe.title}</h3>
                    <p className="text-[13px] text-gray-400 font-medium line-clamp-1">{recipe.desc}</p>
                    <div className="flex items-start">
                         <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] bg-[#EEF5F2] text-[#568A73] text-[11px] font-bold tracking-wide">
                           {recipe.cal}
                         </span>
                    </div>
                </div>
                <div className="pr-2 text-gray-300">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesView;
