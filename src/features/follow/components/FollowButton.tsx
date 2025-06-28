import React from 'react';
import { useFollowStatus } from '@/features/follow/hooks/useFollowStatus';
import { useFollowToggle } from '@/features/follow/hooks/useFollowToggle';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useUser } from '@/features/auth/hooks/useUser';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId, className = '' }) => {
  const { user } = useUser();
  const isSelf = user?.id === targetUserId;
  const { data: isFollowing, isLoading: statusLoading } = useFollowStatus(targetUserId);
  const toggle = useFollowToggle({ targetUserId });

  const handleClick = () => {
    if (toggle.isPending) return;
    toggle.mutate();
  };

  const label = isSelf ? 'You' : isFollowing ? 'Followed' : 'Follow';
  const baseStyles = isSelf
    ? 'bg-gray-500 cursor-default'
    : isFollowing
      ? 'bg-green-600 hover:bg-green-700'
      : 'bg-blue-600 hover:bg-blue-700';

  return (
    <button
      onClick={isSelf ? undefined : handleClick}
      disabled={isSelf || toggle.isPending || statusLoading}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-white transition-colors ${baseStyles} ${className}`}
    >
      {(!isSelf && (toggle.isPending || statusLoading)) && <LoadingSpinner size="sm" />}
      {label}
    </button>
  );
}; 