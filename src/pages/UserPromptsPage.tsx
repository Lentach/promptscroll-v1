import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { PromptGrid } from '@/features/prompts/components';
import { TopPromptsProvider } from '@/features/prompts/hooks/useTopPrompts';
import { BackButton } from '@/components/BackButton';

export const UserPromptsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data: prompts, loading, error, refresh } = useSupabaseQuery<any[]>(
    () =>
      supabase
        .from('prompts')
        .select(
          `*, profiles:profiles!prompts_author_id_fkey (display_name, avatar_url, created_at)`
        )
        .eq('author_id', userId ?? '')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => ({ data, error })) as unknown as Promise<{ data: any[] | null; error: any }>,
    [userId],
  );

  return (
    <TopPromptsProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <BackButton label="Back" fallbackPath="/" className="mr-4" />
          <h2 className="text-2xl font-semibold text-white">User Prompts</h2>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
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
      </div>
    </TopPromptsProvider>
  );
}; 