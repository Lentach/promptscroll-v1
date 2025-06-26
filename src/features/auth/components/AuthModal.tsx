import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { PasswordResetForm } from './PasswordResetForm';
import { SocialAuthButtons } from './SocialAuthButtons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'reset';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [tab, setTab] = useState<'login' | 'register' | 'reset'>(defaultTab);
  const [regSuccess, setRegSuccess] = useState(false);

  if (!isOpen && !regSuccess) return null;

  if (regSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-slate-800/90 rounded-lg shadow-lg p-8 max-w-sm text-center space-y-4">
          <CheckCircle size={48} className="mx-auto text-green-400" />
          <h3 className="text-lg font-semibold text-white">Account created!</h3>
          <p className="text-gray-300 text-sm">Please check your email to verify your account.</p>
          <button
            onClick={() => {
              setRegSuccess(false);
              onClose();
            }}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Simple portal-less modal (fixed overlay)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-300 hover:text-white focus:outline-none"
        >
          <X size={20} />
        </button>

        <div className="bg-slate-800/90 rounded-lg shadow-lg p-6 space-y-6">
          {/* Tabs */}
          <div className="flex justify-center gap-4">
            <button
              className={`px-2 py-1 text-sm font-medium rounded-md focus:outline-none ${
                tab === 'login' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setTab('login')}
            >
              Sign In
            </button>
            <button
              className={`px-2 py-1 text-sm font-medium rounded-md focus:outline-none ${
                tab === 'register' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setTab('register')}
            >
              Sign Up
            </button>
            <button
              className={`px-2 py-1 text-sm font-medium rounded-md focus:outline-none ${
                tab === 'reset' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setTab('reset')}
            >
              Forgot Password
            </button>
          </div>

          {/* Forms */}
          {tab === 'login' && (
            <>
              <SocialAuthButtons mode="sign_in" />
              <LoginForm onSuccess={onClose} />
            </>
          )}
          {tab === 'register' && (
            <RegisterForm onSuccess={() => setRegSuccess(true)} onRegistered={() => setRegSuccess(true)} />
          )}
          {tab === 'reset' && <PasswordResetForm onSuccess={() => setTab('login')} />}        
        </div>
      </div>
    </div>
  );
}; 