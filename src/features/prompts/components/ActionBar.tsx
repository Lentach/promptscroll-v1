import React, { useState, useCallback } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Loader,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';

import { RedirectButton } from '@/components/RedirectButton';
import { useSessionVotes } from '@/hooks/useSessionVotes';
import { usePromptActions } from '@/features/prompts/hooks/usePromptActions';
import type { Prompt } from '@/types';

interface ActionBarProps {
  prompt: Prompt;
  likesCount: number;
  dislikesCount: number;
  usesCount: number;
  setLikesCount: React.Dispatch<React.SetStateAction<number>>;
  setDislikesCount: React.Dispatch<React.SetStateAction<number>>;
  setUsesCount: React.Dispatch<React.SetStateAction<number>>;
  /** Optional callback to propagate updates up the tree */
  onUpdate?: (promptId: string, updates: Partial<Prompt>) => void;
  /** Handler provided by parent so error message can be surfaced in PromptCard */
  setError?: (message: string | null) => void;
}

export function ActionBar({
  prompt,
  likesCount,
  dislikesCount,
  usesCount,
  setLikesCount,
  setDislikesCount,
  setUsesCount,
  onUpdate,
  setError,
}: ActionBarProps) {
  /* -------------------------------------------------------------------- */
  /*                              State & hooks                           */
  /* -------------------------------------------------------------------- */
  const { hasVoted, recordVote } = useSessionVotes();
  const { hasLiked, hasDisliked } = hasVoted(prompt.id);

  const { likePrompt, dislikePrompt, copyPrompt, recordUse, isLoading } =
    usePromptActions({ onUpdate });

  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied'>(
    'idle',
  );

  /* -------------------------------------------------------------------- */
  /*                                Helpers                               */
  /* -------------------------------------------------------------------- */
  const getCopyButtonStyle = () => {
    switch (copyStatus) {
      case 'copying':
        return 'bg-blue-500/30 text-blue-200 border border-blue-400/50 cursor-wait scale-95 shadow-lg shadow-blue-500/20';
      case 'copied':
        return 'bg-green-500/30 text-green-200 border border-green-400/50 scale-105 shadow-xl shadow-green-500/30 animate-pulse';
      default:
        return 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-transparent hover:border-white/20 hover:shadow-lg hover:shadow-white/10 transition-all duration-300';
    }
  };

  const getCopyButtonIcon = () => {
    switch (copyStatus) {
      case 'copying':
        return <Loader className="h-4 w-4 animate-spin" />;
      case 'copied':
        return <Check className="h-4 w-4" />;
      default:
        return <Copy className="h-4 w-4" />;
    }
  };

  const getLikeButtonStyle = () => {
    if (hasLiked)
      return 'bg-green-500/20 text-green-300 border border-green-500/30 scale-105';
    return 'bg-white/10 hover:bg-green-500/20 hover:text-green-200 border border-transparent hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/20';
  };

  const getDislikeButtonStyle = () => {
    if (hasDisliked)
      return 'bg-red-500/20 text-red-300 border border-red-500/30 scale-105';
    return 'bg-white/10 hover:bg-red-500/20 hover:text-red-200 border border-transparent hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/20';
  };

  const getAIModelIcon = (model: string) => {
    const modelConfig = {
      chatgpt: { color: 'from-green-500 via-emerald-500 to-teal-500', glow: 'shadow-green-500/25' },
      'gpt-4': { color: 'from-purple-500 via-blue-500 to-green-500', glow: 'shadow-purple-500/25' },
      claude: { color: 'from-violet-500 via-fuchsia-500 to-pink-500', glow: 'shadow-violet-500/25' },
      dalle: { color: 'from-orange-500 via-red-500 to-pink-500', glow: 'shadow-orange-500/25' },
      midjourney: { color: 'from-pink-500 via-rose-500 to-purple-500', glow: 'shadow-pink-500/25' },
      gemini: { color: 'from-blue-500 via-cyan-500 to-indigo-500', glow: 'shadow-blue-500/25' },
      perplexity: { color: 'from-teal-500 via-cyan-600 to-blue-600', glow: 'shadow-teal-500/25' },
      grok: { color: 'from-black via-gray-900 to-black', glow: 'shadow-black/25' },
      other: { color: 'from-gray-500 via-slate-500 to-gray-600', glow: 'shadow-gray-500/25' },
    } as const;

    return modelConfig[model as keyof typeof modelConfig] || modelConfig.other;
  };

  const modelCfg = getAIModelIcon(prompt.primary_model);

  const getUseButtonStyle = () => {
    if (prompt.primary_model === 'grok') {
      return `
        flex items-center space-x-2 px-3 sm:px-4 py-2 bg-black hover:bg-gray-900 hover:scale-105 hover:shadow-xl hover:shadow-black/50 rounded-xl font-medium transition-all duration-300 text-white shadow-lg text-sm flex-shrink-0 relative overflow-hidden group/use border border-gray-700 hover:border-gray-600`;
    }

    return `
      flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r ${modelCfg.color} hover:opacity-90 hover:scale-105 hover:shadow-xl hover:${modelCfg.glow} rounded-xl font-medium transition-all duration-300 text-white shadow-lg text-sm flex-shrink-0 relative overflow-hidden group/use`;
  };

  const getUseButtonText = () => {
    const labels: Record<string, string> = {
      chatgpt: 'Use in ChatGPT',
      'gpt-4': 'Use in GPT-4',
      claude: 'Use in Claude',
      dalle: 'Use in DALL-E',
      midjourney: 'Use in Midjourney',
      gemini: 'Use in Gemini',
      perplexity: 'Use in Perplexity',
      grok: 'Use in Grok',
    };
    return labels[prompt.primary_model] || 'Use';
  };

  /* -------------------------------------------------------------------- */
  /*                               Handlers                               */
  /* -------------------------------------------------------------------- */

  const handleLike = useCallback(async () => {
    if (hasLiked || isLoading(prompt.id, 'like')) return;

    try {
      setError?.(null);
      let newLikesCount = likesCount;
      let newDislikesCount = dislikesCount;

      if (hasDisliked) {
        newDislikesCount = Math.max(0, dislikesCount - 1);
        setDislikesCount(newDislikesCount);
      }

      const { likes } = await likePrompt(prompt.id, newLikesCount);
      setLikesCount(likes);
      recordVote(prompt.id, 'like');
    } catch {
      setError?.('Failed to like prompt');
    }
  }, [hasLiked, hasDisliked, likesCount, dislikesCount, likePrompt, prompt.id, isLoading, setLikesCount, setDislikesCount, recordVote, setError]);

  const handleDislike = useCallback(async () => {
    if (hasDisliked || isLoading(prompt.id, 'dislike')) return;

    try {
      setError?.(null);
      let newLikesCount = likesCount;
      let newDislikesCount = dislikesCount;

      if (hasLiked) {
        newLikesCount = Math.max(0, likesCount - 1);
        setLikesCount(newLikesCount);
      }

      const { dislikes } = await dislikePrompt(prompt.id, newDislikesCount);
      setDislikesCount(dislikes);
      recordVote(prompt.id, 'dislike');
    } catch {
      setError?.('Failed to dislike prompt');
    }
  }, [hasDisliked, hasLiked, likesCount, dislikesCount, dislikePrompt, prompt.id, isLoading, setLikesCount, setDislikesCount, recordVote, setError]);

  const handleCopy = useCallback(async () => {
    if (copyStatus !== 'idle') return;

    try {
      setCopyStatus('copying');
      setError?.(null);
      const { uses } = await copyPrompt(prompt.id, prompt.content, usesCount);
      setUsesCount(uses);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 3000);
    } catch {
      setError?.('Failed to copy prompt');
      setCopyStatus('idle');
    }
  }, [copyStatus, copyPrompt, prompt.id, prompt.content, usesCount, setUsesCount, setError]);

  const handleRedirectUse = useCallback(async () => {
    try {
      setError?.(null);
      const { uses } = await recordUse(prompt.id, usesCount);
      setUsesCount(uses);
    } catch {
      setError?.('Failed to record prompt use');
    }
  }, [recordUse, prompt.id, usesCount, setUsesCount, setError]);

  /* -------------------------------------------------------------------- */
  /*                                Render                                */
  /* -------------------------------------------------------------------- */

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-white/10 gap-3 sm:gap-0">
      {/* Stats */}
      <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1">
          <ThumbsUp className="h-4 w-4 text-green-400" />
          <span className="font-medium">{likesCount}</span>
        </div>
        <div className="flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1">
          <ThumbsDown className="h-4 w-4 text-red-400" />
          <span className="font-medium">{dislikesCount}</span>
        </div>
        <div className="flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <span className="font-medium">{usesCount}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center sm:justify-end space-x-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleLike}
          disabled={hasLiked || isLoading(prompt.id, 'like')}
          className={`p-2 rounded-xl transition-all duration-300 ${getLikeButtonStyle()}`}
        >
          <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
        </button>

        <button
          type="button"
          onClick={handleDislike}
          disabled={hasDisliked || isLoading(prompt.id, 'dislike')}
          className={`p-2 rounded-xl transition-all duration-300 ${getDislikeButtonStyle()}`}
        >
          <ThumbsDown className={`h-4 w-4 ${hasDisliked ? 'fill-current' : ''}`} />
        </button>

        <button
          type="button"
          onClick={handleCopy}
          disabled={copyStatus !== 'idle'}
          className={`p-2 rounded-xl transition-all duration-300 ${getCopyButtonStyle()}`}
        >
          {getCopyButtonIcon()}
        </button>

        <RedirectButton
          model={prompt.primary_model}
          promptContent={prompt.content}
          onUseComplete={handleRedirectUse}
          className={getUseButtonStyle()}
          type="button"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          <span className="hidden xs:inline sm:inline truncate">{getUseButtonText()}</span>
          <span className="xs:hidden sm:hidden">Use</span>
        </RedirectButton>
      </div>
    </div>
  );
} 