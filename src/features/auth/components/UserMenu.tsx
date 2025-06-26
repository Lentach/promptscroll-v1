import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useLogout } from '../hooks/useLogout';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface UserMenuProps {
  onLoginClick: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onLoginClick }) => {
  const { user, loading } = useUser();
  const logoutMutation = useLogout();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium"
      >
        Sign In
      </button>
    );
  }

  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? null;
  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email ?? '';
  const initial = displayName.length > 0 ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 focus:outline-none"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
        ) : (
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-semibold">
            {initial}
          </span>
        )}
        <ChevronDown size={16} className="text-gray-200" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-gray-700 rounded-md shadow-lg z-20">
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-slate-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}; 