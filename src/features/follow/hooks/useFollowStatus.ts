import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/features/auth/hooks/useUser';

export const useFollowStatus = (targetUserId?: string) => {
  const { user } = useUser();
  return useQuery<boolean>({
    queryKey: ['follow-status', user?.id, targetUserId],
    enabled: !!user && !!targetUserId,
    queryFn: async () => {
      if (!user || !targetUserId) return false;
      const { count, error } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);
      if (error) throw error;
      return (count ?? 0) > 0;
    },
    staleTime: 30000,
  });
}; 