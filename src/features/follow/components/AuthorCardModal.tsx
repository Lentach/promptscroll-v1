import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFollowerCounts } from '@/features/follow/hooks/useFollowerCounts';
import { FollowButton } from '@/features/follow/components/FollowButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface AuthorCardModalProps {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorCardModal: React.FC<AuthorCardModalProps> = ({ userId, displayName, avatarUrl, isOpen, onClose }) => {
  const { data: counts, isLoading } = useFollowerCounts(userId);
  const followers = counts?.followers ?? '…';
  const following = counts?.following ?? '…';

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-xs rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-slate-800/90" onClick={e => e.stopPropagation()}>
        <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400" />
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="p-6 space-y-4 text-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-20 h-20 mx-auto rounded-full object-cover ring-2 ring-purple-500 shadow-md" />
          ) : (
            <span className="w-20 h-20 flex items-center justify-center mx-auto rounded-full bg-purple-600 text-white text-4xl font-semibold shadow-md">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <h3 className="text-lg font-semibold text-white truncate">{displayName}</h3>
          <div className="flex justify-center gap-6 text-sm text-gray-300">
            <div>
              <span className="block text-white text-base font-medium">{isLoading ? <LoadingSpinner size="sm" /> : followers}</span>
              Followers
            </div>
            <div>
              <span className="block text-white text-base font-medium">{isLoading ? <LoadingSpinner size="sm" /> : following}</span>
              Following
            </div>
          </div>
          <FollowButton targetUserId={userId} />
        </div>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
}; 