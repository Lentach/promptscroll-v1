import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useInfiniteQuery } from '@tanstack/react-query';

interface FollowListModalProps {
  userId: string;
  type: 'followers' | 'following';
  isOpen: boolean;
  onClose: () => void;
}

const PAGE_SIZE = 20;

export const FollowListModal: React.FC<FollowListModalProps> = ({ userId, type, isOpen, onClose }) => {
  const fetchPage = async ({ pageParam = 0 }) => {
    const query = supabase
      .from('follows')
      .select(
        type === 'followers'
          ? 'follower_id, profiles:follower_id(display_name, avatar_url)'
          : 'following_id, profiles:following_id(display_name, avatar_url)'
      )
      .order('created_at', { ascending: false })
      .range(pageParam, pageParam + PAGE_SIZE - 1)
      .eq(type === 'followers' ? 'following_id' : 'follower_id', userId);

    const { data, error } = await query;
    if (error) throw error;
    return { data, nextOffset: data.length === PAGE_SIZE ? pageParam + PAGE_SIZE : undefined };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: ['follow-list', type, userId],
    enabled: isOpen,
    initialPageParam: 0,
    queryFn: fetchPage,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });

  // status check strings
  const isLoading = status === 'pending';
  const isError = status === 'error';

  // Infinite scroll listener (optional, simple)
  useEffect(() => {
    if (!isOpen || !hasNextPage) return;
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isFetching) {
        fetchNextPage();
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isOpen, hasNextPage, isFetching, fetchNextPage]);

  if (!isOpen) return null;

  const list = data?.pages.flatMap(p => p.data) ?? [];
  const title = type === 'followers' ? 'Followers' : 'Following';

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-slate-800/90" onClick={e => e.stopPropagation()}>
        <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400" />
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
          <X size={22} />
        </button>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-white text-center mb-2">{title}</h3>
          {isLoading && <LoadingSpinner />}
          {isError && <p className="text-center text-red-400">Failed to load</p>}
          {list.length === 0 && status === 'success' && <p className="text-center text-gray-400">No {title.toLowerCase()} yet.</p>}
          <ul className="space-y-3">
            {list.map((row: any) => {
              const profile = type === 'followers' ? row.profiles : row.profiles;
              if (!profile) return null;
              return (
                <li key={profile.id} className="flex items-center gap-3 bg-slate-700/60 rounded-md p-3">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium">
                      {profile.display_name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-white">{profile.display_name}</span>
                </li>
              );
            })}
          </ul>
          {isFetching && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}; 