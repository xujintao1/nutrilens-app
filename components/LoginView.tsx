import React, { useState } from 'react';
import { signIn } from '../lib/supabase';

interface LoginViewProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigateToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      onLogin();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message.includes('Invalid login credentials')) {
        // 可能是密码错误，也可能是邮箱未验证
        setError('登录失败：请检查邮箱/密码是否正确，或者邮箱是否已验证');
      } else if (err.message.includes('Email not confirmed')) {
        setError('请先验证邮箱后再登录（检查邮箱收件箱和垃圾邮件）');
      } else {
        setError(err.message || '登录失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#A6C4B8] to-[#F7F9F8] flex flex-col px-8 relative overflow-hidden animate-fade-in">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-20%] size-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        {/* Logo Section */}
        <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full transform translate-y-2"></div>
            <div className="size-28 bg-white rounded-[2rem] shadow-xl flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-[64px] text-primary">spa</span>
            </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-[#2C3E36] mb-2 tracking-tight">欢迎回来</h1>
            <p className="text-sm text-[#5C7A6D] font-medium tracking-wider">开启您的智慧饮食生活</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
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
                        placeholder="请输入您的密码"
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

            <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-[#5C7A6D] hover:text-primary transition-colors">
                    忘记密码 ?
                </button>
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
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-fab active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 text-lg disabled:opacity-50"
            >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    登 录
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
            </button>
        </form>

        <div className="mt-8 flex items-center gap-2 text-sm font-medium">
            <span className="text-gray-400">还没有账号 ?</span>
            <button onClick={onNavigateToRegister} className="text-primary font-bold hover:underline">立即注册</button>
        </div>
      </div>

      <div className="pb-8 flex items-center justify-center gap-2">
         <div className="size-5 rounded-full bg-primary flex items-center justify-center shrink-0">
             <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
         </div>
         <p className="text-[10px] text-gray-400">登录即代表您已阅读并同意 <span className="text-primary/80">用户协议</span> 和 <span className="text-primary/80">隐私政策</span></p>
      </div>
    </div>
  );
};

export default LoginView;
