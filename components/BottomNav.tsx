import React, { useState } from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const [animatingTab, setAnimatingTab] = useState<Screen | null>(null);

  const handleNavClick = (screen: Screen) => {
    if (currentScreen === screen) {
      // Trigger animation if already on this screen
      setAnimatingTab(screen);
      setTimeout(() => setAnimatingTab(null), 300);
    } else {
      onNavigate(screen);
    }
  };

  const getIconClass = (screen: Screen) => {
    const isActive = currentScreen === screen;
    const isAnimating = animatingTab === screen;
    
    // Base classes
    let classes = "material-symbols-outlined text-[28px] transition-all duration-300 ease-out ";
    
    // Color logic
    if (isActive) {
      classes += "text-primary ";
    } else {
      classes += "text-gray-400 ";
    }

    // Animation logic
    if (isAnimating) {
      classes += "scale-125 "; 
    }

    return classes;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-6 pt-2 z-50 pointer-events-none">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-auto"></div>
      <div className="relative flex items-center justify-between bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-full px-6 py-2 mb-2 pointer-events-auto">
        <button onClick={() => handleNavClick(Screen.DASHBOARD)} className="p-2">
          <span className={getIconClass(Screen.DASHBOARD)}>home</span>
        </button>
        <button onClick={() => handleNavClick(Screen.STATS)} className="p-2">
          <span className={getIconClass(Screen.STATS)}>bar_chart</span>
        </button>
        <div className="w-12"></div> {/* Spacer for floating camera button */}
        <button onClick={() => handleNavClick(Screen.RECIPES)} className="p-2">
          <span className={getIconClass(Screen.RECIPES)}>menu_book</span>
        </button>
        <button onClick={() => handleNavClick(Screen.PROFILE)} className="p-2">
          <span className={getIconClass(Screen.PROFILE)}>person</span>
        </button>
        
        <button onClick={() => onNavigate(Screen.CAMERA)} className="absolute left-1/2 -translate-x-1/2 -top-6 h-16 w-16 bg-primary text-white rounded-full shadow-fab flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
          <span className="material-symbols-outlined text-[32px]">photo_camera</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;