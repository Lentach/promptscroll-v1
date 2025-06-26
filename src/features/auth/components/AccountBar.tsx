import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useLogout } from '../hooks/useLogout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProfileModal } from './ProfileModal';

export const AccountBar: React.FC = () => {
  const { user, loading } = useUser();
  const logout = useLogout();
  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on click outside for bar not needed now

  if (loading) {
    return (
      <div className="bg-slate-900 border-b border-white/10 w-full flex justify-center py-2">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!user) return null;

  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? null;
  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email ?? '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border-b border-white/10 w-full" ref={ref}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3 text-sm text-gray-200">
        <button
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-2 focus:outline-none"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
          ) : (
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white font-semibold">
              {initial}
            </span>
          )}
          <span className="font-medium truncate max-w-[120px] text-white">
            {displayName}
          </span>
        </button>

        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      </div>
    </div>
  );
}; 