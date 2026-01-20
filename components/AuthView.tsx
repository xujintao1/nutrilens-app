import React, { useState } from 'react';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import VerifyEmailView from './VerifyEmailView';

interface AuthViewProps {
  onAuthSuccess: () => void;
}

type AuthScreen = 'login' | 'register' | 'verify';

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegisterSuccess = (email: string) => {
    setRegisteredEmail(email);
    setCurrentScreen('verify');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  return (
    <div className="h-full w-full">
      {currentScreen === 'login' && (
        <LoginView 
          onLogin={onAuthSuccess}
          onNavigateToRegister={() => setCurrentScreen('register')}
        />
      )}
      {currentScreen === 'register' && (
        <RegisterView 
          onRegister={handleRegisterSuccess}
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      )}
      {currentScreen === 'verify' && (
        <VerifyEmailView 
          email={registeredEmail}
          onBackToLogin={handleBackToLogin}
        />
      )}
    </div>
  );
};

export default AuthView;
