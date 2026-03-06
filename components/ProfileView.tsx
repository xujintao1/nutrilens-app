
import React, { useState, useMemo } from 'react';
import { Screen, Meal } from '../types';
import { signOut } from '../lib/supabase';

interface ProfileViewProps {
    userProfile: {
        name: string;
        weight: number;
        goalWeight: number;
        height: number;
    };
    history: Meal[];
    onNavigate: (s: Screen) => void;
    onLogout: () => void;
}

function getDateKey(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, history, onNavigate, onLogout }) => {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number>(now.getDate());

  const bmi = (userProfile.weight / ((userProfile.height / 100) * (userProfile.height / 100))).toFixed(1);
  const bmiNum = parseFloat(bmi);
  const bmiLabel = bmiNum < 18.5 ? '偏瘦' : bmiNum < 24 ? '正常' : bmiNum < 28 ? '偏胖' : '肥胖';
  const bmiColor = bmiNum < 18.5 ? 'text-blue-500 bg-blue-50' : bmiNum < 24 ? 'text-green-600 bg-green-50' : bmiNum < 28 ? 'text-orange-500 bg-orange-50' : 'text-red-500 bg-red-50';

  const datesWithMeals = useMemo(() => {
    const set = new Set<string>();
    history.forEach(m => {
      const key = getDateKey(m.created_at);
      if (key) set.add(key);
    });
    return set;
  }, [history]);

  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    const todayKey = getDateKey(d.toISOString());
    if (!datesWithMeals.has(todayKey)) {
      d.setDate(d.getDate() - 1);
    }
    while (true) {
      const key = getDateKey(d.toISOString());
      if (datesWithMeals.has(key)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [datesWithMeals]);

  const calendarData = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    return { firstDay, daysInMonth };
  }, [viewYear, viewMonth]);

  const selectedDateMeals = useMemo(() => {
    const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    return history.filter(m => getDateKey(m.created_at) === key);
  }, [history, viewYear, viewMonth, selectedDate]);

  const selectedDateCalories = selectedDateMeals.reduce((s, m) => s + m.kcal, 0);

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDate(1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDate(1);
  };

  return (
    <div className="h-full flex flex-col bg-[#F9FBFA] overflow-y-auto no-scrollbar pb-32">
      <header className="flex items-center justify-between px-6 pt-10 pb-4 sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">个人中心</h1>
        <div className="flex gap-2">
            <button onClick={() => onNavigate(Screen.NOTIFICATIONS)} className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary transition-colors relative">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <button onClick={() => onNavigate(Screen.SETTINGS)} className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>
        </div>
      </header>

      <section className="px-6 py-6">
        <div className="flex items-center gap-4">
            <div className="size-20 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent shadow-md">
                <img src="https://picsum.photos/seed/alex/200" className="w-full h-full rounded-full border-2 border-white object-cover" alt="Avatar" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800">{userProfile.name}</h2>
                <p className="text-gray-400 text-sm font-medium mt-0.5">
                  {streak > 0 
                    ? <>连续打卡 <span className="text-primary font-bold">{streak}</span> 天</>
                    : '今天还没有记录哦'}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
                    <span className="material-symbols-outlined text-primary text-[14px]">local_fire_department</span>
                    <span className="text-[10px] font-bold text-primary">{history.length} 餐记录</span>
                  </div>
                </div>
            </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="px-6 mb-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-soft border border-gray-50">
            <div className="flex items-center justify-between mb-4">
                <button onClick={goToPrevMonth} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_left</span>
                </button>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    {viewYear}年{monthNames[viewMonth]}
                </h3>
                <button onClick={goToNextMonth} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-y-3 text-center">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-gray-300 uppercase">{d}</span>
                ))}
                {Array.from({ length: calendarData.firstDay }, (_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: calendarData.daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasRecord = datesWithMeals.has(dateKey);
                    const isSelected = selectedDate === day;
                    const isCurrentMonth = viewMonth === now.getMonth() && viewYear === now.getFullYear();
                    const isToday = isCurrentMonth && day === now.getDate();
                    
                    return (
                        <div key={day} className="flex flex-col items-center justify-center">
                            <button 
                                onClick={() => setSelectedDate(day)}
                                className={`size-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all relative
                                ${isSelected 
                                    ? 'bg-gray-800 text-white shadow-lg scale-110 z-10' 
                                    : hasRecord 
                                        ? 'bg-primary text-white shadow-md' 
                                        : isToday 
                                            ? 'ring-2 ring-primary/30 text-primary'
                                            : 'text-gray-400 hover:bg-gray-50'
                                }`}
                            >
                                {day}
                                {hasRecord && !isSelected && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-primary/50 rounded-full"></div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between animate-fade-in">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase">{viewMonth + 1}月{selectedDate}日</span>
                    <span className="text-sm font-bold text-gray-800">
                        {selectedDateMeals.length > 0 
                          ? `${selectedDateMeals.length} 餐 · ${selectedDateCalories} kcal`
                          : '当日无记录'}
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

      {/* Stats Cards */}
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
            <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${bmiColor}`}>{bmiLabel}</div>
        </div>
      </section>

      {/* Menu */}
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
