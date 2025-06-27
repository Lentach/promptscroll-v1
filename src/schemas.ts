import { z } from 'zod';

export const promptSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Prompt content must be at least 20 characters'),
  description: z.string().optional(),
  category_ids: z.array(z.string()).min(0),
  primary_model: z.string(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  technique_explanation: z.string().optional(),
  example_output: z.string().optional(),
});

export type PromptFormInput = z.infer<typeof promptSchema>; 