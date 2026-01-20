
import React, { useState } from 'react';
import { Screen } from '../types';
import { signOut } from '../lib/supabase';

interface ProfileViewProps {
    userProfile: {
        name: string;
        weight: number;
        goalWeight: number;
        height: number;
    };
    onNavigate: (s: Screen) => void;
    onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, onNavigate, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());

  // Calculate BMI
  const bmi = (userProfile.weight / ((userProfile.height / 100) * (userProfile.height / 100))).toFixed(1);

  // 模拟日历数据
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const checkedDays = [1, 2, 4, 5, 8, 9, 10, 12, 15, 16, 17, 18, 20];

  return (
    <div className="h-full flex flex-col bg-[#F9FBFA] overflow-y-auto no-scrollbar pb-32">
      <header className="flex items-center justify-between px-6 pt-10 pb-4 sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">个人中心</h1>
        <div className="flex gap-2">
            <button onClick={() => onNavigate(Screen.NOTIFICATIONS)} className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary transition-colors relative">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-400 rounded-full border border-white"></span>
            </button>
            <button onClick={() => onNavigate(Screen.SETTINGS)} className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>
        </div>
      </header>

      {/* 用户信息卡片 */}
      <section className="px-6 py-6">
        <div className="flex items-center gap-4">
            <div className="size-20 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent shadow-md">
                <img src="https://picsum.photos/seed/alex/200" className="w-full h-full rounded-full border-2 border-white object-cover" alt="Avatar" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800">{userProfile.name}</h2>
                <p className="text-gray-400 text-sm font-medium mt-0.5">连续打卡 <span className="text-primary font-bold">12</span> 天</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
                    <span className="material-symbols-outlined text-primary text-[14px]">workspace_premium</span>
                    <span className="text-[10px] font-bold text-primary uppercase">专业版会员</span>
                </div>
            </div>
        </div>
      </section>

      {/* 核心统计日历 */}
      <section className="px-6 mb-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-soft border border-gray-50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    记录日历
                </h3>
                <span className="text-xs font-bold text-gray-400">2024年3月</span>
            </div>
            <div className="grid grid-cols-7 gap-y-3 text-center">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-gray-300 uppercase">{d}</span>
                ))}
                {days.map(day => {
                    const isChecked = checkedDays.includes(day);
                    const isSelected = selectedDate === day;
                    return (
                        <div key={day} className="flex flex-col items-center justify-center">
                            <button 
                                onClick={() => setSelectedDate(day)}
                                className={`size-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all relative
                                ${isSelected 
                                    ? 'bg-gray-800 text-white shadow-lg scale-110 z-10' 
                                    : isChecked 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'text-gray-400 hover:bg-gray-50'
                                }`}
                            >
                                {day}
                                {isChecked && !isSelected && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-primary/50 rounded-full"></div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between animate-fade-in">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase">3月{selectedDate}日</span>
                    <span className="text-sm font-bold text-gray-800">
                        {checkedDays.includes(selectedDate) ? "已完成今日目标 🎉" : "当日无记录"}
                    </span>
                </div>
                <button 
                    onClick={() => onNavigate(Screen.HISTORY)}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                >
                    查看详情 <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
            </div>
        </div>
      </section>

      {/* 指标数据卡片 - Click to Goals */}
      <section className="px-6 grid grid-cols-2 gap-4 mb-8">
        <div onClick={() => onNavigate(Screen.GOALS)} className="bg-white p-5 rounded-[1.5rem] shadow-soft border border-gray-50 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
                <span className="material-symbols-outlined text-[18px]">monitor_weight</span>
                <span className="text-xs font-bold">当前体重</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">{userProfile.weight}</span>
                <span className="text-xs text-gray-400 font-bold">kg</span>
            </div>
            <div className="mt-2 text-[10px] font-bold text-primary">目标: {userProfile.goalWeight}kg</div>
        </div>
        <div onClick={() => onNavigate(Screen.GOALS)} className="bg-white p-5 rounded-[1.5rem] shadow-soft border border-gray-50 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
                <span className="material-symbols-outlined text-[18px]">target</span>
                <span className="text-xs font-bold">BMI指数</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">{bmi}</span>
            </div>
            <div className="mt-2 text-[10px] font-bold text-accent-dark px-2 py-0.5 bg-accent/20 rounded-md inline-block">健康</div>
        </div>
      </section>

      {/* 菜单列表 */}
      <section className="px-6 pb-12 space-y-6">
        <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden border border-gray-50 divide-y divide-gray-50">
            <MenuItem icon="person_outline" label="个人资料" onClick={() => onNavigate(Screen.SETTINGS)} />
            <MenuItem icon="track_changes" label="我的目标" onClick={() => onNavigate(Screen.GOALS)} />
            <MenuItem icon="history" label="历史记录" onClick={() => onNavigate(Screen.HISTORY)} />
            <MenuItem icon="settings" label="偏好设置" onClick={() => onNavigate(Screen.SETTINGS)} />
        </div>
        
        <button 
            onClick={async () => {
                try {
                    await signOut();
                    onLogout();
                } catch (err) {
                    console.error('退出失败:', err);
                }
            }}
            className="w-full py-4 rounded-2xl bg-red-50 text-red-400 font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            退出当前账号
        </button>
      </section>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-5 active:bg-gray-50 transition-colors cursor-pointer group"
  >
    <div className="flex items-center gap-4">
        <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
        <span className="font-bold text-gray-700">{label}</span>
    </div>
    <span className="material-symbols-outlined text-gray-200">chevron_right</span>
  </div>
);

export default ProfileView;
