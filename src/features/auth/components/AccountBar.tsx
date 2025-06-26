import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useLogout } from '../hooks/useLogout';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const AccountBar: React.FC = () => {
  const { user, loading } = useUser();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
          onClick={() => setOpen((v) => !v)}
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

        {open && (
          <div className="absolute left-0 mt-2 bg-slate-800 border border-gray-700 rounded-md shadow-lg z-20 min-w-[150px]">
            <button
              onClick={() => {
                setOpen(false);
                logout.mutate();
              }}
              className="w-full px-4 py-2 text-left text-gray-200 hover:bg-slate-700 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 