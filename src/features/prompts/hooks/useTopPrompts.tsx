import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

interface TopPromptsContextValue {
  topIds: Set<string>;
  refreshTopIds: () => void;
}

const Ctx = createContext<TopPromptsContextValue | undefined>(undefined);

export const TopPromptsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data = [], refresh } = useSupabaseQuery<any[]>(
    async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('id, total_likes, total_uses')
        .order('total_uses', { ascending: false })
        .order('total_likes', { ascending: false })
        .limit(10);
      return { data, error };
    },
    [],
  );

  const topIds = React.useMemo(() => new Set((data ?? []).map((d) => d.id as string)), [data]);

  return <Ctx.Provider value={{ topIds, refreshTopIds: refresh }}>{children}</Ctx.Provider>;
};

export function useTopPrompts() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTopPrompts must be used within TopPromptsProvider');
  return ctx;
} 