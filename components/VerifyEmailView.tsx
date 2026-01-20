import React from 'react';

interface VerifyEmailViewProps {
  email: string;
  onBackToLogin: () => void;
}

const VerifyEmailView: React.FC<VerifyEmailViewProps> = ({ email, onBackToLogin }) => {
  return (
    <div className="h-full w-full bg-gradient-to-b from-[#A6C4B8] to-[#F7F9F8] flex flex-col px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-20%] size-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Success Icon */}
        <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full transform translate-y-2"></div>
            <div className="size-28 bg-white rounded-full shadow-xl flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-[64px] text-primary">mark_email_read</span>
            </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[#2C3E36] mb-3 tracking-tight">验证邮件已发送</h1>
            <p className="text-sm text-[#5C7A6D] font-medium leading-relaxed px-4">
              我们已向 <span className="font-bold text-primary">{email}</span> 发送了验证邮件
            </p>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-2xl p-6 w-full mb-8 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary font-bold text-xs">1</span>
              </div>
              <p className="text-sm text-gray-600">打开您的邮箱，查收来自 NutriLens 的验证邮件</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary font-bold text-xs">2</span>
              </div>
              <p className="text-sm text-gray-600">点击邮件中的验证链接完成注册</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary font-bold text-xs">3</span>
              </div>
              <p className="text-sm text-gray-600">返回此页面，使用邮箱登录</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="text-center mb-8">
          <p className="text-xs text-gray-400">
            <span className="material-symbols-outlined text-[14px] align-middle mr-1">info</span>
            如果没有收到邮件，请检查垃圾邮件文件夹
          </p>
        </div>

        {/* Back to Login Button */}
        <button 
            onClick={onBackToLogin}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-fab active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
        >
            返回登录
            <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      <div className="pb-8"></div>
    </div>
  );
};

export default VerifyEmailView;
