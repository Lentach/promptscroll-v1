import React from 'react';
import { useFollowStatus } from '@/features/follow/hooks/useFollowStatus';
import { useFollowToggle } from '@/features/follow/hooks/useFollowToggle';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId, className = '' }) => {
  const { data: isFollowing, isLoading: statusLoading } = useFollowStatus(targetUserId);
  const toggle = useFollowToggle({ targetUserId });

  const handleClick = () => {
    if (toggle.isPending) return;
    toggle.mutate();
  };

  const label = isFollowing ? 'Unfollow' : 'Follow';
  const baseStyles = isFollowing
    ? 'bg-gray-600 hover:bg-gray-700'
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <button
      onClick={handleClick}
      disabled={toggle.isPending || statusLoading}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-white transition-colors ${baseStyles} ${className}`}
    >
      {(toggle.isPending || statusLoading) && <LoadingSpinner size="sm" />}
      {label}
    </button>
  );
}; 