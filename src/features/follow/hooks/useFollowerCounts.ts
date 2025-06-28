import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useFollowerCounts = (userId?: string | null) => {
  return useQuery<{ followers: number; following: number }>({
    queryKey: ['follower-counts', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error('No userId');
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', userId),
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', userId),
      ]);
      return { followers: followers ?? 0, following: following ?? 0 };
    },
    staleTime: 30000,
  });
}; 