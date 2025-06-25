import { supabase } from '@/lib/supabase';
import { Github } from 'lucide-react';
import type { Provider } from '@supabase/supabase-js';
import React from 'react';

// Custom simple Google icon (outline G)
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 533.5 544.3" width={18} height={18} {...props}>
    <path
      fill="#4285f4"
      d="M533.5 278.4c0-17.4-1.6-34-4.7-50.2H272v95h147.4c-6.4 34-25.2 62.8-53.7 82.1l86.8 67.5c50.8-46.8 81-115.8 81-194.4z"
    />
    <path
      fill="#34a853"
      d="M272 544.3c72.7 0 133.7-24.1 178.3-65.5l-86.8-67.5c-24.1 16.1-55 25.6-91.5 25.6-70 0-129.4-47.4-150.5-111.1l-89.2 69c43.9 90.2 135.5 149.5 239.7 149.5z"
    />
    <path
      fill="#fbbc04"
      d="M121.5 325.8c-9.3-27.8-9.3-57.7 0-85.5l-89.2-69c-39.1 76.4-39.1 167.6 0 244z"
    />
    <path
      fill="#ea4335"
      d="M272 107.7c39.5-.6 77.6 13.8 107.4 40.4l80.1-80C411.5 24.3 343.1-0.7 272 0 167.8 0 76.2 59.3 32.3 149.5l89.2 69c21.1-63.7 80.5-111.1 150.5-111.1z"
    />
  </svg>
);

interface SocialAuthButtonsProps {
  mode?: 'sign_in' | 'sign_up';
}

const providers: { name: string; icon: React.ComponentType<any>; provider: Provider }[] = [
  { name: 'GitHub', icon: Github, provider: 'github' },
  { name: 'Google', icon: GoogleIcon, provider: 'google' },
];

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ mode = 'sign_in' }) => {
  const handleClick = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
  };

  return (
    <div className="flex flex-col space-y-2 w-full mx-auto">
      {providers.map(({ name, icon: Icon, provider }) => (
        <button
          key={provider}
          type="button"
          onClick={() => handleClick(provider)}
          className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-md border border-gray-500/50 text-white hover:bg-white/10 transition-colors"
        >
          <Icon /> Continue with {name}
        </button>
      ))}
    </div>
  );
}; 