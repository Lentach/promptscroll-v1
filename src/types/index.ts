export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string | null;
  category_id: string | null;
  compatible_models: string[];
  primary_model: string;
  is_verified: boolean;
  is_featured: boolean;
  quality_score: number;
  total_uses: number;
  total_likes: number;
  total_dislikes: number;
  technique_explanation: string | null;
  example_output: string | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  author_name: string;
  created_at: string;
  updated_at: string;
  moderation_status: 'pending' | 'approved' | 'rejected';
  categories?: {
    name: string;
    color: string;
    icon: string;
  };
  prompt_tags?: {
    tag: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string;
  created_at: string;
}

export interface ContextualRating {
  id: string;
  prompt_id: string;
  model_used: string;
  use_case: string | null;
  effectiveness_score: number;
  clarity_score: number;
  creativity_score: number;
  review_text: string | null;
  would_recommend: boolean;
  created_at: string;
}

export type SortOption = 'newest' | 'popular' | 'trending';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type AIModel =
  | 'chatgpt'
  | 'claude'
  | 'dalle'
  | 'midjourney'
  | 'gpt-4'
  | 'gemini'
  | 'perplexity'
  | 'grok'
  | 'other';

export interface FilterState {
  category: string;
  search: string;
  sortBy: SortOption;
  difficulty?: DifficultyLevel;
  model?: AIModel;
  verified?: boolean;
}

export interface AppState {
  filters: FilterState;
  ui: {
    showAddPrompt: boolean;
    showAllCategories: boolean;
    highlightedPromptId: string | null;
  };
}
