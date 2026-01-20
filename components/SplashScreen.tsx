
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(141, 170, 157, 0.03) 100%)' }}></div>
      <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
      
      <div className="z-10 flex flex-col items-center animate-fade-in-up">
        <div className="relative mb-8">
          <div className="absolute inset-0 -m-6 rounded-full bg-primary/10 blur-xl"></div>
          <div className="relative flex h-36 w-36 items-center justify-center rounded-[2.5rem] bg-white shadow-xl border border-white/50">
            <span className="material-symbols-outlined text-[88px] text-primary">spa</span>
          </div>
          <div className="absolute -right-2 top-0 h-4 w-4 rounded-full bg-accent shadow-sm"></div>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-800 tracking-tight">NutriLens</h1>
          <p className="text-sm font-medium tracking-[0.2em] text-neutral-400 uppercase mt-2">智能营养管家</p>
        </div>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center">
        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-neutral-100">
          <div className="h-full w-full origin-left -translate-x-full animate-shimmer bg-primary/50"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
