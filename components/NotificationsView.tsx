
import React from 'react';

interface NotificationsViewProps {
  onBack: () => void;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack }) => {
  const notifications = [
    { id: 1, title: '打卡提醒', body: '该吃午饭了！别忘了记录你的餐食哦 🥗', time: '2小时前', icon: 'schedule', color: 'bg-blue-50 text-blue-500' },
    { id: 2, title: '目标达成', body: '恭喜！昨日蛋白质摄入量完美达标 🎉', time: '昨天', icon: 'emoji_events', color: 'bg-yellow-50 text-yellow-500' },
    { id: 3, title: '周报已生成', body: '查看你上周的饮食分析报告，看看有哪些进步吧。', time: '2天前', icon: 'analytics', color: 'bg-purple-50 text-purple-500' },
    { id: 4, title: '新功能上线', body: '我们上线了更精准的 AI 识别模型，快去试试拍照吧！', time: '3天前', icon: 'auto_awesome', color: 'bg-primary/10 text-primary' },
  ];

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

export default NotificationsView;
