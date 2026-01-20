
import React, { useState } from 'react';

interface SettingsViewProps {
  userProfile?: any;
  onUpdateProfile?: (data: any) => void;
  onResetData?: () => void; // New prop for resetting data
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ userProfile, onUpdateProfile, onResetData, onBack }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  
  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userProfile?.name || 'Alex Wang');

  const handleAlert = (feature: string) => {
    alert(`${feature} 功能将在下个版本中推出，敬请期待！`);
  };

  const saveProfile = () => {
    if (onUpdateProfile) {
        onUpdateProfile({ name: tempName });
    }
    setIsEditingProfile(false);
  };

  return (
    <div className="h-full flex flex-col bg-white animate-slide-in-right overflow-y-auto no-scrollbar relative">
      <header className="flex items-center px-6 py-5 sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-50">
        <button onClick={onBack} className="size-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-gray-800">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-10">设置</h1>
      </header>

      <div className="p-6 space-y-8">
        {/* Account Section */}
        <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">账号</h2>
            <div className="bg-[#F9FBFA] rounded-[2rem] p-4 space-y-1">
                <SettingsItem 
                    icon="person" 
                    label="个人资料" 
                    value={userProfile?.name}
                    onClick={() => setIsEditingProfile(true)} 
                />
                 <SettingsItem 
                    icon="lock" 
                    label="账号安全" 
                    onClick={() => handleAlert('账号安全')} 
                />
                 <SettingsItem 
                    icon="workspace_premium" 
                    label="会员订阅" 
                    value="专业版"
                    highlightValue
                    onClick={() => handleAlert('管理订阅')} 
                />
            </div>
        </section>

        {/* Preferences Section */}
        <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">通用</h2>
            <div className="bg-[#F9FBFA] rounded-[2rem] p-4 space-y-1">
                <ToggleItem 
                    icon="notifications" 
                    label="推送通知" 
                    checked={notifications} 
                    onChange={() => setNotifications(!notifications)} 
                />
                <ToggleItem 
                    icon="dark_mode" 
                    label="深色模式" 
                    checked={darkMode} 
                    onChange={() => setDarkMode(!darkMode)} 
                />
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-600">
                            <span className="material-symbols-outlined">straighten</span>
                        </div>
                        <span className="font-bold text-gray-700">单位制式</span>
                    </div>
                    <div className="flex bg-gray-200 p-1 rounded-lg">
                        <button 
                            onClick={() => setUnits('metric')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${units === 'metric' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
                        >
                            公制
                        </button>
                        <button 
                            onClick={() => setUnits('imperial')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${units === 'imperial' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
                        >
                            英制
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* Data Management Section - New */}
        <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">数据管理</h2>
            <div className="bg-[#F9FBFA] rounded-[2rem] p-4 space-y-1">
                 <div 
                    onClick={onResetData}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-red-50 transition-colors cursor-pointer active:scale-[0.99] group"
                >
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm text-red-500 group-hover:bg-red-100 transition-colors">
                            <span className="material-symbols-outlined">delete_forever</span>
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-red-500 transition-colors">重置所有数据</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 text-[20px] group-hover:text-red-300">chevron_right</span>
                </div>
            </div>
        </section>

        {/* Support Section */}
        <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">支持</h2>
            <div className="bg-[#F9FBFA] rounded-[2rem] p-4 space-y-1">
                 <SettingsItem 
                    icon="help" 
                    label="帮助中心" 
                    onClick={() => handleAlert('帮助中心')} 
                />
                 <SettingsItem 
                    icon="info" 
                    label="关于 NutriLens" 
                    value="v1.1.0"
                    onClick={() => handleAlert('关于')} 
                />
            </div>
        </section>

        <div className="pt-4 pb-10 flex flex-col items-center">
            <p className="text-xs text-gray-300 font-medium">NutriLens ID: 8839201</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full rounded-t-[2rem] p-6 animate-slide-up pb-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">编辑资料</h3>
                    <button onClick={() => setIsEditingProfile(false)} className="size-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">昵称</label>
                        <input 
                            type="text" 
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <button 
                        onClick={saveProfile}
                        className="w-full h-14 mt-4 bg-primary text-white font-bold rounded-xl shadow-glow active:scale-[0.98] transition-transform"
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const SettingsItem = ({ icon, label, value, highlightValue, onClick }: any) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 rounded-xl hover:bg-white transition-colors cursor-pointer active:scale-[0.99]">
        <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-600">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span className="font-bold text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className={`text-sm font-medium ${highlightValue ? 'text-primary' : 'text-gray-400'}`}>{value}</span>}
            <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
        </div>
    </div>
);

const ToggleItem = ({ icon, label, checked, onChange }: any) => (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white transition-colors cursor-pointer" onClick={onChange}>
        <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-600">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span className="font-bold text-gray-700">{label}</span>
        </div>
        <div className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 size-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'left-6' : 'left-1'}`}></div>
        </div>
    </div>
);

export default SettingsView;
