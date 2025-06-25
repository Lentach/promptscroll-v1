import React, { useState } from 'react';
import { X } from 'lucide-react';
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

  if (!isOpen) return null;

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
          {tab === 'register' && <RegisterForm onSuccess={onClose} />}
          {tab === 'reset' && <PasswordResetForm onSuccess={() => setTab('login')} />}        
        </div>
      </div>
    </div>
  );
}; 