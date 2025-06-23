/*
  # Complete PromptScroll Database Setup

  1. New Tables
    - `categories` - Organized prompt categories with icons and colors
    - `prompts` - Core prompt data with quality indicators and metadata
    - `contextual_ratings` - Model-specific and use-case-specific ratings
    - `prompt_tags` - Flexible tagging system for better discoverability
    - `quality_indicators` - Trust and verification signals

  2. Security
    - Enable RLS on all tables
    - Public read access for browsing prompts
    - Public write access for adding prompts (MVP approach)
    - Update permissions for likes and usage stats

  3. Sample Data
    - 30+ comprehensive categories
    - 7+ high-quality sample prompts
    - Contextual ratings and feedback
    - Tags and quality indicators
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS quality_indicators CASCADE;
DROP TABLE IF EXISTS prompt_tags CASCADE;
DROP TABLE IF EXISTS contextual_ratings CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Categories table for organized prompt discovery
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  icon text, -- Lucide icon name
  color text DEFAULT '#3B82F6', -- Tailwind color
  created_at timestamptz DEFAULT now()
);

-- Enhanced prompts table with quality indicators
CREATE TABLE prompts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  
  -- AI Model compatibility
  compatible_models text[] DEFAULT '{}', -- ['chatgpt', 'claude', 'dalle', 'midjourney']
  primary_model text NOT NULL, -- Main model this prompt was designed for
  
  -- Quality and trust indicators
  is_verified boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  quality_score numeric(3,2) DEFAULT 0.00, -- Calculated average quality
  total_uses integer DEFAULT 0,
  total_likes integer DEFAULT 0,
  
  -- Educational metadata
  technique_explanation text, -- Why this prompt works
  example_output text, -- Sample result
  difficulty_level text DEFAULT 'beginner', -- beginner, intermediate, advanced
  
  -- Content moderation
  is_flagged boolean DEFAULT false,
  moderation_status text DEFAULT 'approved', -- pending, approved, rejected
  
  -- Metadata
  author_name text DEFAULT 'Anonymous',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contextual ratings - the key innovation
CREATE TABLE contextual_ratings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  
  -- Context specificity
  model_used text NOT NULL, -- Which AI model was used
  use_case text, -- What was the specific use case
  
  -- Multi-dimensional ratings
  effectiveness_score integer CHECK (effectiveness_score >= 1 AND effectiveness_score <= 5),
  clarity_score integer CHECK (clarity_score >= 1 AND clarity_score <= 5),
  creativity_score integer CHECK (creativity_score >= 1 AND creativity_score <= 5),
  
  -- User feedback
  review_text text,
  would_recommend boolean DEFAULT true,
  
  -- Metadata
  user_ip text, -- For basic spam prevention
  created_at timestamptz DEFAULT now()
);

-- Flexible tagging system
CREATE TABLE prompt_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quality indicators for trust building
CREATE TABLE quality_indicators (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  indicator_type text NOT NULL, -- 'verified', 'community_favorite', 'expert_reviewed', 'tested'
  indicator_value text, -- Additional context
  awarded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contextual_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_indicators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read prompts" ON prompts FOR SELECT USING (moderation_status = 'approved');
CREATE POLICY "Allow public read ratings" ON contextual_ratings FOR SELECT USING (true);
CREATE POLICY "Allow public read tags" ON prompt_tags FOR SELECT USING (true);
CREATE POLICY "Allow public read quality indicators" ON quality_indicators FOR SELECT USING (true);

-- RLS Policies for public write access (MVP - no authentication)
CREATE POLICY "Allow public insert prompts" ON prompts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert ratings" ON contextual_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert tags" ON prompt_tags FOR INSERT WITH CHECK (true);

-- RLS Policies for updates (likes, uses)
CREATE POLICY "Allow public update prompt stats" ON prompts 
  FOR UPDATE USING (true) 
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_prompts_category ON prompts(category_id);
CREATE INDEX idx_prompts_model ON prompts(primary_model);
CREATE INDEX idx_prompts_quality ON prompts(quality_score DESC);
CREATE INDEX idx_prompts_created ON prompts(created_at DESC);
CREATE INDEX idx_contextual_ratings_prompt ON contextual_ratings(prompt_id);
CREATE INDEX idx_contextual_ratings_model ON contextual_ratings(model_used);
CREATE INDEX idx_prompt_tags_prompt ON prompt_tags(prompt_id);
CREATE INDEX idx_prompt_tags_tag ON prompt_tags(tag);

-- Function to update quality score based on contextual ratings
CREATE OR REPLACE FUNCTION update_prompt_quality_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prompts 
  SET quality_score = (
    SELECT ROUND(
      (AVG(effectiveness_score) + AVG(clarity_score) + AVG(creativity_score)) / 3.0, 
      2
    )
    FROM contextual_ratings 
    WHERE prompt_id = NEW.prompt_id
  )
  WHERE id = NEW.prompt_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update quality scores
CREATE TRIGGER update_quality_score_trigger
  AFTER INSERT OR UPDATE ON contextual_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_prompt_quality_score();

-- Insert comprehensive categories
INSERT INTO categories (name, description, icon, color) VALUES
-- Core AI Models
('ChatGPT', 'Text generation, conversation, and analysis prompts', 'MessageSquare', '#10B981'),
('Claude', 'Reasoning, analysis, and creative writing prompts', 'Brain', '#8B5CF6'),
('DALL-E', 'Image generation and visual creativity prompts', 'Image', '#F59E0B'),
('Midjourney', 'Artistic image creation and style prompts', 'Palette', '#EF4444'),
('GPT-4', 'Advanced GPT-4 specific prompts and techniques', 'Zap', '#10B981'),
('Gemini', 'Google Gemini AI prompts and applications', 'Gem', '#4285F4'),
('Perplexity', 'Research and fact-finding prompts', 'Search', '#20B2AA'),

-- Core Categories
('Coding', 'Programming, debugging, and code review prompts', 'Code', '#3B82F6'),
('Creative', 'Creative writing, storytelling, and content creation', 'Feather', '#EC4899'),
('Business', 'Marketing, strategy, and professional communication', 'Briefcase', '#6366F1'),
('Education', 'Learning, teaching, and knowledge transfer prompts', 'GraduationCap', '#059669'),

-- Industry Specific
('Marketing', 'Digital marketing, advertising, and brand strategy', 'Megaphone', '#FF6B6B'),
('Sales', 'Sales copy, outreach, and conversion optimization', 'TrendingUp', '#4ECDC4'),
('HR', 'Human resources, recruitment, and team management', 'Users', '#45B7D1'),
('Finance', 'Financial analysis, budgeting, and investment', 'DollarSign', '#96CEB4'),
('Legal', 'Legal documents, contracts, and compliance', 'Scale', '#FFEAA7'),
('Healthcare', 'Medical, wellness, and healthcare applications', 'Heart', '#FD79A8'),

-- Content Types
('Social Media', 'Posts, captions, and social media content', 'Share2', '#E17055'),
('Email', 'Email marketing, newsletters, and communication', 'Mail', '#74B9FF'),
('Blog', 'Blog posts, articles, and long-form content', 'FileText', '#A29BFE'),
('Video', 'Video scripts, YouTube, and multimedia content', 'Video', '#FF7675'),
('Presentations', 'Slides, pitches, and presentation content', 'Monitor', '#FDCB6E'),

-- Technical
('Data Analysis', 'Data science, analytics, and insights', 'BarChart3', '#00B894'),
('DevOps', 'Infrastructure, deployment, and operations', 'Server', '#636E72'),
('Security', 'Cybersecurity, privacy, and risk assessment', 'Shield', '#E84393'),
('API', 'API documentation, integration, and development', 'Code2', '#00CEC9'),

-- Creative & Design
('UX/UI', 'User experience and interface design', 'Palette', '#6C5CE7'),
('Copywriting', 'Sales copy, headlines, and persuasive writing', 'PenTool', '#FD79A8'),
('Storytelling', 'Narratives, fiction, and creative writing', 'BookOpen', '#FDCB6E'),
('Branding', 'Brand strategy, identity, and positioning', 'Award', '#E17055'),

-- Specialized
('Research', 'Academic research, analysis, and citations', 'BookOpen', '#74B9FF'),
('Translation', 'Language translation and localization', 'Languages', '#00B894'),
('SEO', 'Search engine optimization and content strategy', 'Search', '#FDCB6E'),
('Customer Support', 'Help desk, FAQ, and customer service', 'MessageCircle', '#55A3FF'),
('Project Management', 'Planning, coordination, and team leadership', 'CheckSquare', '#26DE81'),
('Training', 'Learning materials, courses, and skill development', 'GraduationCap', '#A29BFE');

-- Insert high-quality sample prompts
INSERT INTO prompts (
  title, 
  content, 
  description, 
  category_id, 
  compatible_models, 
  primary_model, 
  technique_explanation, 
  example_output, 
  difficulty_level, 
  is_verified, 
  is_featured,
  quality_score, 
  total_likes, 
  total_uses,
  author_name
) VALUES 
-- ChatGPT Business Prompts
(
  'Executive Summary Generator',
  'Create a comprehensive executive summary for the following business proposal. Structure it with: 1) Problem Statement, 2) Proposed Solution, 3) Market Opportunity, 4) Financial Projections, 5) Implementation Timeline, 6) Risk Assessment. Keep it concise but compelling for C-level executives.

Business Proposal: [INSERT_PROPOSAL_HERE]',
  'Generate professional executive summaries that capture key business insights for leadership',
  (SELECT id FROM categories WHERE name = 'Business'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Uses structured formatting and executive-level language to ensure clarity and impact for decision-makers',
  'A well-structured 2-page executive summary with clear sections, financial highlights, and actionable recommendations that executives can quickly digest and act upon.',
  'intermediate',
  true,
  true,
  4.7,
  89,
  156,
  'BusinessPro'
),
(
  'Senior Code Reviewer',
  'Act as a senior software developer with 10+ years of experience. Review the following code for best practices, potential bugs, security issues, and performance optimizations. Provide specific, actionable feedback with code examples where applicable:

[CODE_HERE]',
  'Get professional code review feedback with specific improvements and examples',
  (SELECT id FROM categories WHERE name = 'Coding'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Uses role-playing technique with specific expertise level and structured review criteria',
  'Detailed analysis covering code structure, security vulnerabilities, performance bottlenecks, and specific refactoring suggestions with code examples.',
  'intermediate',
  true,
  false,
  4.8,
  156,
  89,
  'SeniorDev'
),
(
  'Social Media Content Calendar',
  'Create a 30-day social media content calendar for [BRAND/BUSINESS] targeting [TARGET_AUDIENCE]. Include:

1. **Content Themes**: Mix of educational, entertaining, promotional, and behind-the-scenes content
2. **Platform Optimization**: Tailor content for Instagram, LinkedIn, Twitter, and Facebook
3. **Engagement Hooks**: Questions, polls, and interactive elements
4. **Hashtag Strategy**: Relevant and trending hashtags for each post
5. **Call-to-Actions**: Clear CTAs that drive engagement and conversions
6. **Visual Suggestions**: Ideas for images, videos, and graphics

Format as a calendar with specific post ideas, optimal posting times, and engagement strategies.',
  'Generate comprehensive social media content calendars with platform-specific strategies',
  (SELECT id FROM categories WHERE name = 'Social Media'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Combines content marketing strategy with platform-specific optimization and engagement psychology',
  'Detailed 30-day calendar with daily post ideas, optimal timing, hashtag suggestions, and engagement strategies tailored to each platform.',
  'intermediate',
  true,
  true,
  4.6,
  89,
  156,
  'SocialMediaPro'
),
(
  'Professional Product Photography',
  'Professional product photography of [PRODUCT], clean white background, studio lighting setup with key light at 45 degrees, fill light to reduce shadows, rim light for edge definition, shot with Canon EOS R5, 85mm macro lens, f/11 for sharp focus, ISO 100, commercial quality, high resolution, minimal post-processing look',
  'Create professional product photos perfect for e-commerce and marketing',
  (SELECT id FROM categories WHERE name = 'DALL-E'),
  ARRAY['dalle', 'midjourney'],
  'dalle',
  'Replicates professional photography techniques and equipment settings for commercial-quality results',
  'Crisp, professional product image with perfect lighting, sharp details, and clean background suitable for any commercial use.',
  'beginner',
  true,
  false,
  4.4,
  156,
  234,
  'PhotoPro'
),
(
  'Strategic Business Analyst',
  'I need you to analyze a business situation using structured strategic thinking. Please:

1. **Situation Analysis**: Break down the key factors and stakeholders
2. **Problem Identification**: Identify the core issues and their root causes
3. **Options Generation**: Develop 3-4 strategic options with pros/cons
4. **Recommendation**: Provide your recommended approach with rationale
5. **Implementation**: Outline key steps and potential risks

Business situation: [SITUATION_HERE]',
  'Get structured strategic analysis for complex business decisions',
  (SELECT id FROM categories WHERE name = 'Business'),
  ARRAY['claude', 'chatgpt'],
  'claude',
  'Uses Claude''s analytical strengths with clear framework and step-by-step reasoning structure',
  'Comprehensive strategic analysis with clear problem breakdown, multiple solution options, and actionable implementation plan.',
  'advanced',
  true,
  true,
  4.9,
  134,
  76,
  'StrategyConsultant'
),
(
  'Cold Email Sequence Generator',
  'Create a 5-email cold outreach sequence for [PRODUCT/SERVICE] targeting [IDEAL_CUSTOMER]. Each email should:

**Email 1 - Introduction**: Personalized opener, value proposition, soft CTA
**Email 2 - Value Add**: Helpful resource, industry insight, no pitch
**Email 3 - Social Proof**: Case study, testimonial, credibility building
**Email 4 - Urgency**: Limited time offer, scarcity, clear benefit
**Email 5 - Final Touch**: Last chance, alternative solution, relationship focus

Include subject lines, personalization tokens, and follow-up timing. Focus on building relationships, not just selling.',
  'Create high-converting cold email sequences that build relationships and drive sales',
  (SELECT id FROM categories WHERE name = 'Sales'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Uses proven sales psychology and email marketing best practices to create sequences that convert',
  'Complete 5-email sequence with compelling subject lines, personalized content, and strategic timing that builds trust and drives conversions.',
  'advanced',
  true,
  false,
  4.7,
  67,
  98,
  'SalesExpert'
),
(
  'Character Development Workshop',
  'Create a complex, multi-dimensional character for a [GENRE] story. Develop: 1) Basic demographics and appearance, 2) Personality traits with contradictions, 3) Backstory with formative experiences, 4) Goals, motivations, and fears, 5) Speech patterns and mannerisms, 6) Character arc potential, 7) Relationships with other characters.

Character concept: [INSERT_CONCEPT_HERE]
Story context: [INSERT_CONTEXT_HERE]',
  'Develop rich, complex characters with depth and authentic motivations',
  (SELECT id FROM categories WHERE name = 'Creative'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Uses character development techniques from professional screenwriting and novel writing to create believable, complex characters',
  'Detailed character profile with psychological depth, clear motivations, and specific mannerisms that bring the character to life.',
  'intermediate',
  true,
  true,
  4.7,
  112,
  89,
  'StoryMaster'
);

-- Insert contextual ratings for sample prompts
INSERT INTO contextual_ratings (
  prompt_id,
  model_used,
  use_case,
  effectiveness_score,
  clarity_score,
  creativity_score,
  review_text,
  would_recommend
) VALUES 
-- Executive Summary Generator ratings
(
  (SELECT id FROM prompts WHERE title = 'Executive Summary Generator'),
  'chatgpt',
  'Business Strategy',
  5,
  5,
  4,
  'Perfect for board presentations. Saved me hours of work and the executives loved the clear structure.',
  true
),
(
  (SELECT id FROM prompts WHERE title = 'Executive Summary Generator'),
  'claude',
  'Investment Proposals',
  4,
  5,
  4,
  'Great structure but Claude sometimes over-analyzes. Still very useful for investor decks.',
  true
),
-- Senior Code Reviewer ratings
(
  (SELECT id FROM prompts WHERE title = 'Senior Code Reviewer'),
  'chatgpt',
  'Code Quality',
  5,
  4,
  4,
  'Caught several security issues I missed. The performance suggestions were particularly valuable.',
  true
),
(
  (SELECT id FROM prompts WHERE title = 'Senior Code Reviewer'),
  'claude',
  'Security Audit',
  5,
  5,
  3,
  'Excellent for security reviews. Claude''s analysis is thorough and the explanations are clear.',
  true
),
-- Social Media Content Calendar ratings
(
  (SELECT id FROM prompts WHERE title = 'Social Media Content Calendar'),
  'chatgpt',
  'Social Media Marketing',
  5,
  4,
  5,
  'Incredible for planning social media strategy. The platform-specific suggestions were spot-on and saved me weeks of planning.',
  true
),
-- Strategic Business Analyst ratings
(
  (SELECT id FROM prompts WHERE title = 'Strategic Business Analyst'),
  'claude',
  'Business Strategy',
  5,
  5,
  4,
  'Best decision-making tool I''ve used. The SWOT analysis was comprehensive and the recommendation was solid.',
  true
),
-- Cold Email Sequence ratings
(
  (SELECT id FROM prompts WHERE title = 'Cold Email Sequence Generator'),
  'chatgpt',
  'Sales Outreach',
  5,
  5,
  4,
  'Best cold email template I''ve used. The psychology behind each email is solid and response rates improved significantly.',
  true
),
-- Character Development ratings
(
  (SELECT id FROM prompts WHERE title = 'Character Development Workshop'),
  'chatgpt',
  'Creative Writing',
  4,
  4,
  5,
  'Helped me create my most compelling character yet. The psychological depth suggestions were brilliant.',
  true
);

-- Insert tags for better discoverability
INSERT INTO prompt_tags (prompt_id, tag) VALUES
-- Executive Summary Generator tags
((SELECT id FROM prompts WHERE title = 'Executive Summary Generator'), 'business'),
((SELECT id FROM prompts WHERE title = 'Executive Summary Generator'), 'executive'),
((SELECT id FROM prompts WHERE title = 'Executive Summary Generator'), 'strategy'),
((SELECT id FROM prompts WHERE title = 'Executive Summary Generator'), 'presentation'),

-- Senior Code Reviewer tags
((SELECT id FROM prompts WHERE title = 'Senior Code Reviewer'), 'coding'),
((SELECT id FROM prompts WHERE title = 'Senior Code Reviewer'), 'code-review'),
((SELECT id FROM prompts WHERE title = 'Senior Code Reviewer'), 'security'),
((SELECT id FROM prompts WHERE title = 'Senior Code Reviewer'), 'best-practices'),

-- Social Media Content Calendar tags
((SELECT id FROM prompts WHERE title = 'Social Media Content Calendar'), 'social-media'),
((SELECT id FROM prompts WHERE title = 'Social Media Content Calendar'), 'content-planning'),
((SELECT id FROM prompts WHERE title = 'Social Media Content Calendar'), 'marketing-strategy'),
((SELECT id FROM prompts WHERE title = 'Social Media Content Calendar'), 'instagram'),
((SELECT id FROM prompts WHERE title = 'Social Media Content Calendar'), 'linkedin'),

-- Product Photography tags
((SELECT id FROM prompts WHERE title = 'Professional Product Photography'), 'photography'),
((SELECT id FROM prompts WHERE title = 'Professional Product Photography'), 'product'),
((SELECT id FROM prompts WHERE title = 'Professional Product Photography'), 'ecommerce'),
((SELECT id FROM prompts WHERE title = 'Professional Product Photography'), 'commercial'),

-- Strategic Business Analyst tags
((SELECT id FROM prompts WHERE title = 'Strategic Business Analyst'), 'strategy'),
((SELECT id FROM prompts WHERE title = 'Strategic Business Analyst'), 'decision-making'),
((SELECT id FROM prompts WHERE title = 'Strategic Business Analyst'), 'business-analysis'),
((SELECT id FROM prompts WHERE title = 'Strategic Business Analyst'), 'consulting'),

-- Cold Email Sequence tags
((SELECT id FROM prompts WHERE title = 'Cold Email Sequence Generator'), 'cold-email'),
((SELECT id FROM prompts WHERE title = 'Cold Email Sequence Generator'), 'sales-outreach'),
((SELECT id FROM prompts WHERE title = 'Cold Email Sequence Generator'), 'email-marketing'),
((SELECT id FROM prompts WHERE title = 'Cold Email Sequence Generator'), 'lead-generation'),

-- Character Development tags
((SELECT id FROM prompts WHERE title = 'Character Development Workshop'), 'creative-writing'),
((SELECT id FROM prompts WHERE title = 'Character Development Workshop'), 'character'),
((SELECT id FROM prompts WHERE title = 'Character Development Workshop'), 'storytelling'),
((SELECT id FROM prompts WHERE title = 'Character Development Workshop'), 'fiction');

-- Insert quality indicators for featured prompts
INSERT INTO quality_indicators (prompt_id, indicator_type, indicator_value) VALUES
-- Executive Summary Generator
((SELECT id FROM prompts WHERE title = 'Executive Summary Generator'), 'expert_reviewed', 'Business Strategy Expert'),
((SELECT id FROM prompts WHERE title = 'Executive Summary Generator'), 'tested', 'Tested with 50+ business proposals'),

-- Senior Code Reviewer
((SELECT id FROM prompts WHERE title = 'Senior Code Reviewer'), 'expert_reviewed', 'Senior Software Engineer'),
((SELECT id FROM prompts WHERE title = 'Senior Code Reviewer'), 'tested', 'Reviewed 200+ code submissions'),

-- Social Media Content Calendar
((SELECT id FROM prompts WHERE title = 'Social Media Content Calendar'), 'expert_reviewed', 'Social Media Marketing Expert'),
((SELECT id FROM prompts WHERE title = 'Social Media Content Calendar'), 'community_favorite', 'Most used marketing prompt'),

-- Strategic Business Analyst
((SELECT id FROM prompts WHERE title = 'Strategic Business Analyst'), 'expert_reviewed', 'Management Consultant'),
((SELECT id FROM prompts WHERE title = 'Strategic Business Analyst'), 'tested', 'Used in 100+ strategic decisions'),

-- Character Development Workshop
((SELECT id FROM prompts WHERE title = 'Character Development Workshop'), 'expert_reviewed', 'Professional Writer'),
((SELECT id FROM prompts WHERE title = 'Character Development Workshop'), 'community_favorite', 'Top creative writing prompt');