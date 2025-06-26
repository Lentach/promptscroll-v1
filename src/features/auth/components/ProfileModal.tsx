import React, { useEffect, useState } from 'react';
import { X, UserCircle, Image as ImageIcon, LogOut, FileText } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { createPortal } from 'react-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const logout = useLogout();
  const [promptCount, setPromptCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !isOpen) return;
    (async () => {
      const { count } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id);
      if (typeof count === 'number') setPromptCount(count);
    })();
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? null;
  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email ?? '';
  const initial = displayName.charAt(0).toUpperCase();

  // Modal content to portal
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animation-fade"
      onClick={onClose}
    >
      {/* STOP propagation so clicking inside card doesn't close */}
      <div
        className="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-slate-800/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400" />

        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar & basic info */}
          <div className="flex flex-col items-center gap-2">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-purple-500 shadow-md"
              />
            ) : (
              <span className="w-24 h-24 flex items-center justify-center rounded-full bg-purple-600 text-white text-4xl font-semibold shadow-md">
                {initial}
              </span>
            )}

            <label className="flex items-center gap-1.5 text-xs text-blue-400 cursor-pointer hover:underline">
              <ImageIcon size={14} /> Change avatar
              <input type="file" className="hidden" onChange={() => alert('TODO: upload avatar')} />
            </label>

            <h3 className="text-xl font-semibold text-white truncate max-w-[220px] text-center">
              {displayName}
            </h3>
            <p className="text-sm text-gray-400 truncate max-w-[240px] text-center">{user.email}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-700/60 rounded-md p-3 flex flex-col items-center">
              <FileText className="text-blue-400 mb-1" size={20} />
              <span className="text-lg font-medium text-white">{promptCount ?? '…'}</span>
              <span className="text-xs text-gray-400">Prompts</span>
            </div>
            <div className="bg-slate-700/60 rounded-md p-3 flex flex-col items-center">
              <UserCircle className="text-green-400 mb-1" size={20} />
              <span className="text-lg font-medium text-white">Member</span>
              <span className="text-xs text-gray-400">since 2025</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to="/my-prompts"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 py-2 text-white transition-colors"
            >
              <FileText size={16} /> View My Prompts
            </Link>

            <button
              onClick={() => {
                logout.mutate();
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-red-600 hover:bg-red-700 py-2 text-white transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}; 