import React, { createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabaseQuery } from './useSupabaseQuery';

interface TopPromptsContextValue {
  topIds: Set<string>;
  refreshTopIds: () => void;
}

const TopPromptsContext = createContext<TopPromptsContextValue | undefined>(undefined);

export const TopPromptsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, refreshTop } = ((): { data: any[]; refreshTop: () => void } => {
    const { data, refresh } = useSupabaseQuery<any[]>(
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
    return { data: data ?? [], refreshTop: refresh };
  })();

  const topIds = React.useMemo(() => new Set((data || []).map((d) => d.id as string)), [data]);

  return (
    <TopPromptsContext.Provider value={{ topIds, refreshTopIds: refreshTop }}>
      {children}
    </TopPromptsContext.Provider>
  );
};

export function useTopPrompts() {
  const ctx = useContext(TopPromptsContext);
  if (!ctx) throw new Error('useTopPrompts must be used within TopPromptsProvider');
  return ctx;
}
