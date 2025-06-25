import { useMemo } from 'react';
import { useAuth } from './useAuth';

/**
 * Returns the Supabase `user` object and loading state.
 */
export const useUser = () => {
  const { session, loading } = useAuth();

  const user = useMemo(() => session?.user ?? null, [session]);

  return { user, loading, isAuthenticated: !!user } as const;
}; 