import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

interface VoteState {
  [promptId: string]: {
    hasLiked: boolean;
    hasDisliked: boolean;
    timestamp: number;
  };
}

interface UseSessionVotesReturn {
  hasVoted: (promptId: string) => { hasLiked: boolean; hasDisliked: boolean };
  recordVote: (promptId: string, type: 'like' | 'dislike') => void;
  canVote: (promptId: string) => boolean;
  clearVotes: () => void;
}

const STORAGE_KEY = STORAGE_KEYS.SESSION_VOTES;
const VOTE_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown per prompt

export function useSessionVotes(): UseSessionVotesReturn {
  const [votes, setVotes] = useState<VoteState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage whenever votes change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch (error) {
      console.warn('Failed to save votes to localStorage:', error);
    }
  }, [votes]);

  const hasVoted = useCallback(
    (promptId: string) => {
      const vote = votes[promptId];
      if (!vote) return { hasLiked: false, hasDisliked: false };

      // Check if vote is still valid (within cooldown period)
      const now = Date.now();
      const isExpired = now - vote.timestamp > VOTE_COOLDOWN;

      if (isExpired) {
        // Remove expired vote
        setVotes((prev) => {
          const newVotes = { ...prev };
          delete newVotes[promptId];
          return newVotes;
        });
        return { hasLiked: false, hasDisliked: false };
      }

      return {
        hasLiked: vote.hasLiked,
        hasDisliked: vote.hasDisliked,
      };
    },
    [votes],
  );

  const canVote = useCallback(
    (promptId: string) => {
      const { hasLiked, hasDisliked } = hasVoted(promptId);
      return !hasLiked && !hasDisliked;
    },
    [hasVoted],
  );

  const recordVote = useCallback((promptId: string, type: 'like' | 'dislike') => {
    setVotes((prev) => ({
      ...prev,
      [promptId]: {
        hasLiked: type === 'like',
        hasDisliked: type === 'dislike',
        timestamp: Date.now(),
      },
    }));
  }, []);

  const clearVotes = useCallback(() => {
    setVotes({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    hasVoted,
    recordVote,
    canVote,
    clearVotes,
  };
}
