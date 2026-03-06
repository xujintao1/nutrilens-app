
import React, { useMemo } from 'react';
import { Meal } from '../types';

interface NotificationsViewProps {
  todayMeals: Meal[];
  userProfile: { dailyCalories: number };
  onBack: () => void;
}

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  icon: string;
  color: string;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ todayMeals, userProfile, onBack }) => {
  const notifications = useMemo(() => {
    const items: Notification[] = [];
    let id = 1;
    const hour = new Date().getHours();
    const todayCal = todayMeals.reduce((s, m) => s + m.kcal, 0);
    const todayProtein = todayMeals.reduce((s, m) => s + (m.macros?.protein || 0), 0);
    const proteinTarget = Math.round(userProfile.dailyCalories * 0.3 / 4);

    if (hour >= 7 && hour < 10 && !todayMeals.some(m => m.type === '早餐')) {
      items.push({
        id: id++, title: '早餐提醒',
        body: '早上好!还没有记录早餐，健康的一天从营养早餐开始哦~',
        time: '刚刚', icon: 'wb_sunny', color: 'bg-orange-50 text-orange-500'
      });
    }
    if (hour >= 11 && hour < 14 && !todayMeals.some(m => m.type === '午餐')) {
      items.push({
        id: id++, title: '午餐提醒',
        body: '该吃午饭了!别忘了记录你的餐食哦~',
        time: '刚刚', icon: 'schedule', color: 'bg-blue-50 text-blue-500'
      });
    }
    if (hour >= 17 && hour < 20 && !todayMeals.some(m => m.type === '晚餐')) {
      items.push({
        id: id++, title: '晚餐提醒',
        body: '晚餐时间到!记得选择清淡的食物，控制热量摄入。',
        time: '刚刚', icon: 'dinner_dining', color: 'bg-purple-50 text-purple-500'
      });
    }

    if (todayCal > 0 && todayCal <= userProfile.dailyCalories * 0.8) {
      items.push({
        id: id++, title: '热量进度',
        body: `今日已摄入 ${todayCal} 千卡，还可以摄入 ${userProfile.dailyCalories - todayCal} 千卡。`,
        time: '今天', icon: 'local_fire_department', color: 'bg-green-50 text-green-500'
      });
    }
    if (todayCal > userProfile.dailyCalories) {
      items.push({
        id: id++, title: '热量超标提醒',
        body: `今日摄入 ${todayCal} 千卡，已超出目标 ${todayCal - userProfile.dailyCalories} 千卡。建议适当运动消耗多余热量。`,
        time: '今天', icon: 'warning', color: 'bg-red-50 text-red-500'
      });
    }

    if (todayProtein >= proteinTarget * 0.8 && todayProtein > 0) {
      items.push({
        id: id++, title: '蛋白质达标',
        body: `今日蛋白质摄入 ${todayProtein}g，${todayProtein >= proteinTarget ? '已完美达标!' : '距离目标很近了!'}`,
        time: '今天', icon: 'emoji_events', color: 'bg-yellow-50 text-yellow-500'
      });
    }

    items.push({
      id: id++, title: '饮食小贴士',
      body: getDailyTip(),
      time: '每日推送', icon: 'tips_and_updates', color: 'bg-primary/10 text-primary'
    });

    return items;
  }, [todayMeals, userProfile]);

  return (
    <div className="h-full flex flex-col bg-[#F9FBFA] animate-slide-in-right overflow-y-auto no-scrollbar">
      <header className="flex items-center px-6 py-5 sticky top-0 bg-[#F9FBFA]/90 backdrop-blur-md z-20">
        <button onClick={onBack} className="size-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-gray-800">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-10">消息通知</h1>
      </header>

      <div className="px-6 space-y-4 pb-10">
        {notifications.map(n => (
            <div key={n.id} className="bg-white p-4 rounded-2xl shadow-soft border border-gray-50 flex gap-4">
                <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${n.color}`}>
                    <span className="material-symbols-outlined">{n.icon}</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-800 text-sm">{n.title}</h4>
                        <span className="text-[10px] text-gray-400 font-medium">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{n.body}</p>
                </div>
            </div>
        ))}
        
        <div className="text-center mt-8">
            <p className="text-xs text-gray-300 font-medium">没有更多消息了</p>
        </div>
      </div>
    </div>
  );
};

function getDailyTip(): string {
  const tips = [
    '每天至少喝 8 杯水，有助于促进新陈代谢和排毒。',
    '尽量选择全谷物代替精制碳水，膳食纤维更丰富。',
    '饭前喝一杯水可以增加饱腹感，有助于控制食量。',
    '蛋白质有助于延长饱腹感，每餐都应适量摄入。',
    '多吃深色蔬菜，富含维生素和矿物质，热量低营养高。',
    '细嚼慢咽有助于消化吸收，也能更好地控制进食量。',
    '晚餐不宜太晚，建议在睡前 3 小时前完成进食。',
    '坚果是优质脂肪的来源，但要注意控制份量(每天约一小把)。',
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return tips[dayOfYear % tips.length];
}

export default NotificationsView;
