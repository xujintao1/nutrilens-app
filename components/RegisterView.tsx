import React, { useState } from 'react';
import { signUp } from '../lib/supabase';

interface RegisterViewProps {
  onRegister: (email: string) => void;
  onNavigateToLogin: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onNavigateToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('密码至少需要6位');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      console.log('开始注册...', { email, username });
      const result = await signUp(email, password, username);
      console.log('注册结果:', result);
      
      // 检查是否是已存在的用户（identities 为空表示用户已存在但未验证）
      if (result.user && result.user.identities && result.user.identities.length === 0) {
        setError('该邮箱已注册但未验证，请检查邮箱中的验证链接，或使用其他邮箱');
        return;
      }
      
      onRegister(email); // 传递邮箱用于显示验证提示
    } catch (err: any) {
      console.error('注册失败:', err);
      if (err.message.includes('User already registered')) {
        setError('该邮箱已注册，请直接登录');
      } else if (err.message.includes('Password should be at least')) {
        setError('密码至少需要6位');
      } else if (err.message.includes('Unable to validate email')) {
        setError('请输入有效的邮箱地址');
      } else {
        setError(err.message || '注册失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#A6C4B8] to-[#F7F9F8] flex flex-col px-8 relative overflow-hidden animate-slide-in-right">
      <div className="absolute top-[-10%] right-[-20%] size-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-6">
        {/* Logo Section */}
        <div className="mb-6 relative scale-90">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full transform translate-y-2"></div>
            <div className="size-28 bg-white rounded-[2rem] shadow-xl flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-[64px] text-primary">spa</span>
            </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#2C3E36] mb-2 tracking-tight">创建账号</h1>
            <p className="text-sm text-[#5C7A6D] font-medium tracking-wider">开启您的智慧饮食生活</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A6359] ml-1">用户名</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">person</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="请输入您的用户名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-white text-gray-800 py-4 pl-12 pr-4 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-300 font-medium"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A6359] ml-1">邮箱</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">mail</span>
                    </div>
                    <input 
                        type="email" 
                        placeholder="请输入您的邮箱"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white text-gray-800 py-4 pl-12 pr-4 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-300 font-medium"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A6359] ml-1">密码</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
                    </div>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="设置您的密码（至少6位）"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white text-gray-800 py-4 pl-12 pr-12 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-300 font-medium"
                        required
                        minLength={6}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A6359] ml-1">确认密码</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
                    </div>
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="请再次输入密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white text-gray-800 py-4 pl-12 pr-12 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-300 font-medium"
                        required
                        minLength={6}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-fab active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 text-lg disabled:opacity-50"
            >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    注 册
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
            </button>
        </form>

        <div className="mt-8 flex items-center gap-2 text-sm font-medium">
            <span className="text-gray-400">已有账号 ?</span>
            <button onClick={onNavigateToLogin} className="text-primary font-bold hover:underline">立即登录</button>
        </div>
      </div>
      
      <div className="pb-8 flex items-center justify-center gap-2">
         <div className="size-5 rounded-full bg-primary flex items-center justify-center shrink-0">
             <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
         </div>
         <p className="text-[10px] text-gray-400">注册即代表您已阅读并同意 <span className="text-primary/80">用户协议</span> 和 <span className="text-primary/80">隐私政策</span></p>
      </div>
    </div>
  );
};

export default RegisterView;
