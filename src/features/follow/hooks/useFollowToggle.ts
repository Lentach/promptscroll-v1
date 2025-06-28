import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/features/auth/hooks/useUser';

interface Params {
  targetUserId: string;
}

export const useFollowToggle = ({ targetUserId }: Params) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['follow-toggle', user?.id, targetUserId],
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      // Check if already following
      const { data, error } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);
      if (error) throw error;

      if (data && data.length > 0) {
        // Unfollow
        const { error: delErr } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);
        if (delErr) throw delErr;
        return { followed: false };
      } else {
        // Follow
        const { error: insErr } = await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: targetUserId });
        if (insErr) throw insErr;
        return { followed: true };
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['follower-counts', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['follower-counts', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['follow-status', user?.id, targetUserId] });
    },
  });
}; 