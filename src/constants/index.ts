// Centralised application constants to avoid repeated literals across the codebase
// and make future maintenance easier.

import type { DifficultyLevel } from '../types';

/* -------------------------------------------------------------------------- */
/*                               Supabase tables                              */
/* -------------------------------------------------------------------------- */

export const SUPABASE_TABLES = {
  PROMPTS: 'prompts',
  CATEGORIES: 'categories',
  PROMPT_TAGS: 'prompt_tags',
  PROMPT_CATEGORIES: 'prompt_categories',
} as const;

/* -------------------------------------------------------------------------- */
/*                           LocalStorage / Session                           */
/* -------------------------------------------------------------------------- */

export const STORAGE_KEYS = {
  /** Tracks like / dislike state per-session to prevent vote-spamming */
  SESSION_VOTES: 'promptscroll-session-votes',
} as const;

/* -------------------------------------------------------------------------- */
/*                               Difficulty meta                              */
/* -------------------------------------------------------------------------- */

type DifficultyMeta = {
  value: DifficultyLevel;
  label: string;
  color: string; // Tailwind text-color class used in UI badges
  description: string;
};

export const DIFFICULTY_LEVELS: readonly DifficultyMeta[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    color: 'text-green-400',
    description: 'Easy to use and understand',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    color: 'text-yellow-400',
    description: 'Requires some experience',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    color: 'text-red-400',
    description: 'For experienced users',
  },
] as const;

// Quick lookup for coloured badges when only value is known.
export const DIFFICULTY_COLOR_MAP: Record<DifficultyLevel, string> = DIFFICULTY_LEVELS.reduce(
  (acc, { value, color }) => {
    acc[value] = color;
    return acc;
  },
  {} as Record<DifficultyLevel, string>,
);

/* -------------------------------------------------------------------------- */
/*                                  Re-exports                                */
/* -------------------------------------------------------------------------- */

// Export AI model meta so consumers can `import { AI_MODELS } from "../constants"`.
export { AI_MODELS, getAIModelMeta } from './aiModels'; 