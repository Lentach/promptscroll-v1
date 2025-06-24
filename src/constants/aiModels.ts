import type { ComponentType, SVGProps } from 'react';

// A minimal interface for AI model metadata that is needed outside of UI.
// Icon and styling properties are optional because some places (e.g. PromptCard) already
// define their own visual treatment. Consumers can extend this interface if needed.
export interface AIModelMeta {
  /** Human-readable name rendered in labels */
  name: string;
  /** URL to open when the user wants to try the prompt in this model */
  url: string;
  /** Optional React component returning an SVG icon so UI can render a logo */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

// NOTE: Keep keys in lowercase snake/slug format – they are stored in DB as primary_model.
export const AI_MODELS = {
  chatgpt: {
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
  },
  'gpt-4': {
    name: 'GPT-4',
    url: 'https://chat.openai.com/',
  },
  claude: {
    name: 'Claude',
    url: 'https://claude.ai/',
  },
  dalle: {
    name: 'DALL·E',
    url: 'https://labs.openai.com/',
  },
  midjourney: {
    name: 'Midjourney',
    url: 'https://www.midjourney.com/',
  },
  gemini: {
    name: 'Gemini',
    url: 'https://gemini.google.com/app',
  },
  perplexity: {
    name: 'Perplexity',
    url: 'https://perplexity.ai/',
  },
  grok: {
    name: 'Grok (xAI)',
    url: 'https://grok.x.ai/',
  },
} as const satisfies Record<string, AIModelMeta>;

export type AIModelKey = keyof typeof AI_MODELS;

// Helper to get metadata or fallback.
export function getAIModelMeta(model: string): AIModelMeta {
  return (
    (AI_MODELS as Record<string, AIModelMeta>)[model] ?? {
      name: model,
      url: 'https://www.google.com/search?q=' + encodeURIComponent(model + ' AI'),
    }
  );
}
