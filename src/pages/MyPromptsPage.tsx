import React from 'react';
import { useUser } from '@/features/auth/hooks/useUser';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import { PromptGrid } from '@/features/prompts/components';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TopPromptsProvider } from '@/features/prompts/hooks/useTopPrompts';

export const MyPromptsPage: React.FC = () => {
  const { user } = useUser();

  const { data: prompts, loading, error, refresh } = useSupabaseQuery<any[]>(
    () =>
      supabase
        .from('prompts')
        .select('*')
        .eq('author_id', user?.id ?? '')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => ({ data, error })) as unknown as Promise<{ data: any[] | null; error: any }>,
    [user?.id],
  );

  if (!user) return <p className="text-center text-gray-300 py-16">Please sign in to view your prompts.</p>;

  return (
    <TopPromptsProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold text-white mb-6">My Prompts</h2>
        <PromptGrid
          prompts={prompts || []}
          loading={loading}
          error={error}
          hasMore={false}
          sortBy="newest"
          totalCount={prompts?.length ?? 0}
          onPromptUpdate={() => refresh()}
        />
      </div>
    </TopPromptsProvider>
  );
}; 