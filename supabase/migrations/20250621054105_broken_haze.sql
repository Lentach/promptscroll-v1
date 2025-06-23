/*
  # Add More Quality Prompts for Infinite Scroll Testing

  1. Additional Prompts
    - 20+ new high-quality prompts across different categories
    - Diverse AI models and use cases
    - Realistic ratings and engagement metrics
    - Professional-grade content for testing

  2. Enhanced Data
    - Contextual ratings for each prompt
    - Relevant tags for discoverability
    - Quality indicators for trust building
*/

-- Insert additional high-quality prompts
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

-- Marketing & Sales Prompts
(
  'LinkedIn Post Generator',
  'Create an engaging LinkedIn post about [TOPIC] that:

1. **Hook**: Start with a compelling question or surprising statistic
2. **Story**: Share a brief personal anecdote or case study
3. **Value**: Provide 3-5 actionable insights or tips
4. **Engagement**: End with a question to encourage comments
5. **Hashtags**: Include 3-5 relevant professional hashtags

Tone: Professional but conversational
Length: 150-200 words
Target: [TARGET_AUDIENCE]',
  'Generate engaging LinkedIn posts that drive professional engagement and build thought leadership',
  (SELECT id FROM categories WHERE name = 'Social Media'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Uses proven LinkedIn engagement formulas with storytelling and value-driven content structure',
  'Professional LinkedIn post with compelling hook, valuable insights, and strong call-to-action that generates 50+ comments and shares.',
  'beginner',
  true,
  false,
  4.5,
  78,
  145,
  'LinkedInPro'
),

(
  'Customer Persona Builder',
  'Create a detailed customer persona for [PRODUCT/SERVICE]. Include:

**Demographics**: Age, gender, income, location, education
**Psychographics**: Values, interests, lifestyle, personality traits
**Behavioral Patterns**: Shopping habits, media consumption, decision-making process
**Pain Points**: Primary challenges and frustrations
**Goals & Motivations**: What they want to achieve
**Preferred Channels**: Where they spend time online/offline
**Buying Journey**: Awareness → Consideration → Decision stages
**Messaging**: Key messages that resonate with this persona

Use real data and research when possible. Make it specific and actionable for marketing teams.',
  'Build detailed customer personas that guide marketing strategy and messaging',
  (SELECT id FROM categories WHERE name = 'Marketing'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Combines market research methodology with practical marketing application for actionable personas',
  'Comprehensive customer persona with specific demographics, pain points, and actionable marketing insights.',
  'intermediate',
  true,
  true,
  4.6,
  92,
  167,
  'MarketingStrategist'
),

(
  'Sales Objection Handler',
  'I need responses to common sales objections for [PRODUCT/SERVICE]. For each objection, provide:

1. **Acknowledge**: Validate their concern
2. **Clarify**: Ask a follow-up question to understand better
3. **Respond**: Address the objection with evidence/benefits
4. **Confirm**: Check if you''ve resolved their concern
5. **Advance**: Move the conversation forward

Common objections to address:
- "It''s too expensive"
- "I need to think about it"
- "We''re happy with our current solution"
- "I don''t have budget right now"
- "I need to discuss with my team"

Provide specific scripts that feel natural and consultative, not pushy.',
  'Handle sales objections professionally with proven frameworks that build trust and close deals',
  (SELECT id FROM categories WHERE name = 'Sales'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Uses consultative selling methodology with psychological principles for objection handling',
  'Complete objection handling scripts with natural dialogue that addresses concerns and advances the sale.',
  'advanced',
  true,
  false,
  4.7,
  134,
  89,
  'SalesTrainer'
),

-- Creative & Content Prompts
(
  'Blog Post Outline Generator',
  'Create a comprehensive blog post outline for: "[BLOG_TOPIC]"

Target audience: [TARGET_AUDIENCE]
Word count goal: [WORD_COUNT]
SEO keyword: [PRIMARY_KEYWORD]

Structure:
**I. Introduction** (10% of content)
- Hook: Compelling opening
- Problem: What challenge does this solve?
- Promise: What will readers learn?

**II. Main Content** (80% of content)
- 3-5 main sections with subheadings
- Each section should have 2-3 supporting points
- Include data, examples, or case studies
- Add actionable tips or steps

**III. Conclusion** (10% of content)
- Summary of key points
- Call-to-action
- Next steps for readers

Include: Meta description, internal linking opportunities, and content upgrade ideas.',
  'Create detailed blog post outlines that rank well and engage readers from start to finish',
  (SELECT id FROM categories WHERE name = 'Blog'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Combines SEO best practices with content marketing strategy for maximum impact and engagement',
  'Detailed blog outline with SEO optimization, engaging structure, and clear action items for writers.',
  'intermediate',
  true,
  true,
  4.4,
  67,
  123,
  'ContentStrategist'
),

(
  'YouTube Video Script Writer',
  'Write a YouTube video script for: "[VIDEO_TOPIC]"

Video length: [DURATION] minutes
Target audience: [AUDIENCE]
Channel style: [EDUCATIONAL/ENTERTAINMENT/REVIEW]

**Script Structure:**

**HOOK (0-15 seconds)**
- Attention-grabbing opening
- Preview of value/outcome
- Subscribe reminder

**INTRODUCTION (15-45 seconds)**
- Brief personal intro
- What this video covers
- Why it matters to viewers

**MAIN CONTENT (70% of video)**
- 3-5 key points with smooth transitions
- Include examples, demonstrations, or stories
- Keep energy high with varied pacing
- Add engagement prompts ("comment below if...")

**CONCLUSION (Last 10%)**
- Recap key takeaways
- Clear call-to-action
- End screen suggestions

Include: Thumbnail ideas, description template, and engagement hooks throughout.',
  'Create engaging YouTube scripts that keep viewers watching and drive channel growth',
  (SELECT id FROM categories WHERE name = 'Video'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Uses YouTube algorithm optimization with storytelling techniques for maximum retention and engagement',
  'Complete video script with hooks, transitions, and engagement elements that boost watch time and subscriber growth.',
  'intermediate',
  true,
  false,
  4.5,
  89,
  156,
  'YouTubeCreator'
),

(
  'Email Newsletter Template',
  'Create an email newsletter template for [BUSINESS/BRAND]:

**Subject Line Options** (3 variations):
- Curiosity-driven
- Benefit-focused  
- Urgency/FOMO

**Email Structure:**

**Header**: Brand greeting and personal touch

**Main Content**:
1. **Featured Story**: Main article/update (150-200 words)
2. **Quick Hits**: 3-4 brief industry news/tips (50 words each)
3. **Spotlight**: Product/service highlight or customer story
4. **Community**: User-generated content or testimonial

**Footer**:
- Clear unsubscribe
- Social media links
- Contact information

**Design Notes**: Mobile-friendly, scannable format, consistent branding

Include: A/B testing suggestions and engagement metrics to track.',
  'Design newsletter templates that subscribers love to read and share',
  (SELECT id FROM categories WHERE name = 'Email'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Combines email marketing best practices with engagement psychology for higher open and click rates',
  'Professional newsletter template with high-converting structure and engaging content that builds subscriber loyalty.',
  'beginner',
  true,
  true,
  4.3,
  56,
  134,
  'EmailMarketer'
),

-- Technical & Development Prompts
(
  'API Documentation Generator',
  'Create comprehensive API documentation for the following endpoint:

**Endpoint**: [METHOD] [URL]
**Purpose**: [BRIEF_DESCRIPTION]

Generate:

**Overview**
- Brief description of what this endpoint does
- Use cases and when to use it

**Authentication**
- Required headers/tokens
- Permission levels needed

**Request**
- HTTP method and URL structure
- Required and optional parameters
- Request body schema (if applicable)
- Example request with curl and JavaScript

**Response**
- Success response format
- Error response formats
- HTTP status codes
- Example responses

**Rate Limiting**
- Request limits and time windows
- Headers returned

**Code Examples**
- Multiple programming languages (JavaScript, Python, PHP)
- SDK examples if available

**Testing**
- How to test the endpoint
- Common troubleshooting tips',
  'Generate professional API documentation that developers can easily understand and implement',
  (SELECT id FROM categories WHERE name = 'API'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Follows industry standards for API documentation with comprehensive examples and clear structure',
  'Complete API documentation with examples, error handling, and implementation guides across multiple languages.',
  'intermediate',
  true,
  false,
  4.6,
  78,
  98,
  'APIDocExpert'
),

(
  'Database Schema Designer',
  'Design a database schema for [APPLICATION_TYPE]. Provide:

**Tables Structure**:
For each table include:
- Table name and purpose
- Column definitions (name, type, constraints)
- Primary and foreign keys
- Indexes for performance

**Relationships**:
- Entity relationship diagram description
- Foreign key relationships
- Junction tables for many-to-many

**Constraints**:
- Data validation rules
- Unique constraints
- Check constraints

**Performance Considerations**:
- Recommended indexes
- Partitioning strategies (if needed)
- Query optimization tips

**Security**:
- Row-level security suggestions
- Sensitive data handling
- Access control recommendations

**Migration Strategy**:
- Initial setup SQL
- Future schema evolution considerations

Provide both PostgreSQL and MySQL versions where syntax differs.',
  'Design scalable database schemas with proper relationships and performance optimization',
  (SELECT id FROM categories WHERE name = 'Data Analysis'),
  ARRAY['claude', 'chatgpt'],
  'claude',
  'Uses database design principles with performance and scalability considerations for production systems',
  'Complete database schema with optimized structure, relationships, and migration scripts ready for production.',
  'advanced',
  true,
  true,
  4.8,
  145,
  67,
  'DatabaseArchitect'
),

(
  'React Component Builder',
  'Create a reusable React component for [COMPONENT_PURPOSE]. Include:

**Component Structure**:
```jsx
// Component with TypeScript interfaces
// Props validation and default values
// Proper state management (useState/useEffect)
// Event handlers and callbacks
```

**Features**:
- Responsive design with Tailwind CSS
- Accessibility (ARIA labels, keyboard navigation)
- Error handling and loading states
- Customizable styling props

**Props Interface**:
- Define all props with TypeScript
- Include optional and required props
- Provide sensible defaults

**Usage Examples**:
- Basic implementation
- Advanced configuration
- Integration with forms/state management

**Testing Considerations**:
- Unit test suggestions
- Edge cases to test
- Accessibility testing notes

**Documentation**:
- Component description
- Props table
- Usage guidelines

Make it production-ready with proper error boundaries and performance optimization.',
  'Build production-ready React components with TypeScript, accessibility, and best practices',
  (SELECT id FROM categories WHERE name = 'Coding'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Follows React best practices with TypeScript, accessibility, and performance optimization for production use',
  'Complete React component with TypeScript interfaces, styling, documentation, and usage examples.',
  'advanced',
  true,
  false,
  4.7,
  123,
  89,
  'ReactDeveloper'
),

-- Business & Strategy Prompts
(
  'Competitive Analysis Framework',
  'Conduct a comprehensive competitive analysis for [YOUR_COMPANY] in the [INDUSTRY] space.

**Direct Competitors** (3-5 companies):
For each competitor analyze:

**Company Overview**:
- Business model and revenue streams
- Target market and positioning
- Key value propositions

**Product/Service Analysis**:
- Feature comparison matrix
- Pricing strategy
- Strengths and weaknesses

**Marketing Strategy**:
- Brand positioning and messaging
- Marketing channels and tactics
- Content strategy and thought leadership

**Performance Metrics**:
- Market share and growth rate
- Customer reviews and satisfaction
- Financial performance (if public)

**SWOT Analysis**:
- Strengths, Weaknesses, Opportunities, Threats
- Competitive advantages and vulnerabilities

**Strategic Recommendations**:
- Market gaps and opportunities
- Differentiation strategies
- Competitive response tactics

Include data sources and methodology for ongoing monitoring.',
  'Perform thorough competitive analysis that reveals market opportunities and strategic advantages',
  (SELECT id FROM categories WHERE name = 'Business'),
  ARRAY['claude', 'chatgpt'],
  'claude',
  'Uses strategic analysis frameworks with systematic approach to competitive intelligence gathering',
  'Comprehensive competitive analysis with actionable insights and strategic recommendations for market positioning.',
  'advanced',
  true,
  true,
  4.9,
  167,
  78,
  'StrategyConsultant'
),

(
  'Financial Model Builder',
  'Create a financial model for [BUSINESS_TYPE] with the following components:

**Revenue Model**:
- Revenue streams and pricing strategy
- Customer acquisition and retention rates
- Monthly/annual recurring revenue projections
- Seasonal variations and growth assumptions

**Cost Structure**:
- Fixed costs (rent, salaries, software)
- Variable costs (materials, commissions, shipping)
- One-time costs (equipment, setup, marketing)

**Key Metrics**:
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Gross margin and contribution margin
- Break-even analysis

**Financial Projections** (3-5 years):
- Monthly cash flow for Year 1
- Annual P&L statements
- Balance sheet projections
- Scenario analysis (best/worst/realistic)

**Funding Requirements**:
- Initial capital needs
- Working capital requirements
- Growth capital for scaling

**Return Analysis**:
- ROI calculations
- Payback periods
- Sensitivity analysis

Provide Excel formulas and assumptions documentation.',
  'Build comprehensive financial models for business planning and investor presentations',
  (SELECT id FROM categories WHERE name = 'Finance'),
  ARRAY['claude', 'chatgpt'],
  'claude',
  'Uses financial modeling best practices with scenario planning and sensitivity analysis for accurate projections',
  'Complete financial model with projections, scenarios, and key metrics ready for business planning and fundraising.',
  'advanced',
  true,
  false,
  4.8,
  134,
  56,
  'FinancialAnalyst'
),

-- Creative & Design Prompts
(
  'Brand Identity Designer',
  'Develop a complete brand identity for [COMPANY_NAME] in the [INDUSTRY] sector.

**Brand Foundation**:
- Mission, vision, and values
- Brand personality (5-7 key traits)
- Unique value proposition
- Target audience definition

**Visual Identity**:
- Logo concept and variations
- Color palette (primary, secondary, neutral)
- Typography system (headings, body, accent)
- Imagery style and photography direction

**Brand Voice & Messaging**:
- Tone of voice guidelines
- Key messaging pillars
- Tagline options
- Communication do''s and don''ts

**Brand Applications**:
- Business card and letterhead design
- Website design principles
- Social media templates
- Marketing collateral guidelines

**Brand Guidelines**:
- Logo usage rules
- Color specifications (HEX, RGB, CMYK)
- Typography hierarchy
- Spacing and layout principles

**Implementation Strategy**:
- Rollout timeline
- Touchpoint priorities
- Brand consistency checklist

Ensure the brand is memorable, differentiated, and scalable across all channels.',
  'Create comprehensive brand identities that resonate with target audiences and drive business growth',
  (SELECT id FROM categories WHERE name = 'Branding'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Combines brand strategy with visual design principles for cohesive and impactful brand development',
  'Complete brand identity package with visual elements, messaging framework, and implementation guidelines.',
  'advanced',
  true,
  true,
  4.6,
  89,
  123,
  'BrandStrategist'
),

(
  'UX Research Plan',
  'Create a UX research plan for [PRODUCT/FEATURE] to understand [RESEARCH_OBJECTIVE].

**Research Goals**:
- Primary research questions
- Success metrics and KPIs
- Stakeholder requirements

**Research Methods**:
- User interviews (script and questions)
- Usability testing protocol
- Surveys and questionnaires
- Analytics and behavioral data

**Participant Recruitment**:
- Target user segments
- Screening criteria
- Sample size and demographics
- Recruitment channels

**Research Timeline**:
- Planning and preparation phase
- Data collection period
- Analysis and synthesis
- Reporting and presentation

**Data Collection Tools**:
- Interview guides and scripts
- Testing scenarios and tasks
- Survey instruments
- Analytics setup

**Analysis Framework**:
- Data synthesis methods
- Insight categorization
- Persona updates
- Journey mapping

**Deliverables**:
- Research findings report
- Actionable recommendations
- Design implications
- Next steps and follow-up research

Include templates and tools for each research method.',
  'Design comprehensive UX research plans that generate actionable insights for product development',
  (SELECT id FROM categories WHERE name = 'UX/UI'),
  ARRAY['claude', 'chatgpt'],
  'claude',
  'Uses UX research methodology with systematic approach to user insight generation and analysis',
  'Complete UX research plan with methods, tools, and frameworks for generating actionable user insights.',
  'advanced',
  true,
  false,
  4.7,
  78,
  145,
  'UXResearcher'
),

-- Education & Training Prompts
(
  'Course Curriculum Designer',
  'Design a comprehensive online course curriculum for "[COURSE_TOPIC]".

**Course Overview**:
- Learning objectives and outcomes
- Target audience and prerequisites
- Course duration and time commitment
- Certification or completion criteria

**Module Structure** (6-10 modules):
For each module include:
- Module title and learning objectives
- Key concepts and topics covered
- Lesson breakdown (3-5 lessons per module)
- Practical exercises and assignments
- Assessment methods

**Content Types**:
- Video lessons (duration and topics)
- Reading materials and resources
- Interactive exercises and quizzes
- Projects and case studies
- Discussion prompts

**Assessment Strategy**:
- Formative assessments (quizzes, exercises)
- Summative assessments (projects, exams)
- Peer review and feedback
- Self-assessment tools

**Engagement Elements**:
- Community building activities
- Live sessions or office hours
- Gamification elements
- Progress tracking

**Resources & Materials**:
- Required and recommended readings
- Tools and software needed
- Templates and worksheets
- Additional learning resources

Include a detailed timeline and instructor preparation guide.',
  'Create engaging online course curricula that deliver measurable learning outcomes',
  (SELECT id FROM categories WHERE name = 'Education'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Uses instructional design principles with adult learning theory for effective knowledge transfer',
  'Complete course curriculum with structured modules, assessments, and engagement strategies for online learning.',
  'advanced',
  true,
  true,
  4.5,
  67,
  134,
  'InstructionalDesigner'
),

-- HR & Management Prompts
(
  'Performance Review Template',
  'Create a comprehensive performance review template for [ROLE/DEPARTMENT].

**Review Period**: [TIME_FRAME]
**Employee**: [NAME] | **Manager**: [NAME] | **Date**: [DATE]

**Performance Areas**:

**1. Goal Achievement**:
- Previous period goals and outcomes
- Quantitative results vs. targets
- Qualitative achievements and impact

**2. Core Competencies**:
- Job-specific skills and expertise
- Technical proficiency
- Quality of work and attention to detail

**3. Behavioral Competencies**:
- Communication and collaboration
- Problem-solving and initiative
- Adaptability and learning agility
- Leadership and mentoring (if applicable)

**4. Professional Development**:
- Skills acquired during review period
- Training completed and certifications
- Areas for continued growth

**5. Feedback & Recognition**:
- Peer and stakeholder feedback
- Notable achievements and contributions
- Recognition received

**Goal Setting for Next Period**:
- SMART goals for upcoming period
- Development objectives
- Support and resources needed

**Career Development Discussion**:
- Career aspirations and interests
- Potential growth opportunities
- Succession planning considerations

Include rating scales, comment sections, and action planning templates.',
  'Conduct fair and comprehensive performance reviews that drive employee development and engagement',
  (SELECT id FROM categories WHERE name = 'HR'),
  ARRAY['chatgpt', 'claude'],
  'chatgpt',
  'Uses performance management best practices with structured feedback and development planning',
  'Complete performance review template with structured evaluation criteria and development planning tools.',
  'intermediate',
  true,
  false,
  4.4,
  89,
  167,
  'HRManager'
),

-- Image Generation Prompts
(
  'Minimalist Logo Design',
  'Minimalist logo design for [COMPANY_NAME], clean geometric shapes, modern typography, [BRAND_COLORS], negative space utilization, scalable vector style, professional business aesthetic, simple and memorable, suitable for digital and print applications, white background, high contrast, contemporary design language',
  'Create clean, professional logos perfect for modern businesses and startups',
  (SELECT id FROM categories WHERE name = 'DALL-E'),
  ARRAY['dalle', 'midjourney'],
  'dalle',
  'Uses minimalist design principles with focus on scalability and brand recognition',
  'Clean, professional logo with strong brand recognition that works across all media and applications.',
  'beginner',
  true,
  true,
  4.3,
  156,
  234,
  'LogoDesigner'
),

(
  'Social Media Graphics',
  'Instagram post graphic for [TOPIC/BRAND], modern flat design style, vibrant gradient background [COLOR_SCHEME], clean typography with [FONT_STYLE], minimal icons and illustrations, mobile-optimized composition, 1080x1080 pixels, engaging visual hierarchy, brand-consistent styling, professional social media aesthetic',
  'Generate eye-catching social media graphics that drive engagement and brand awareness',
  (SELECT id FROM categories WHERE name = 'DALL-E'),
  ARRAY['dalle', 'midjourney'],
  'dalle',
  'Optimizes for social media algorithms with engaging visual elements and mobile-first design',
  'Stunning social media graphic with high engagement potential and strong brand consistency.',
  'beginner',
  true,
  false,
  4.2,
  134,
  189,
  'SocialDesigner'
),

(
  'Website Hero Section',
  'Website hero section illustration for [BUSINESS_TYPE], modern isometric style, [COLOR_PALETTE], clean geometric shapes, subtle shadows and depth, professional business aesthetic, scalable vector graphics, web-optimized composition, engaging visual metaphors for [INDUSTRY], contemporary design trends, suitable for SaaS/tech companies',
  'Create compelling hero section illustrations that convert visitors into customers',
  (SELECT id FROM categories WHERE name = 'DALL-E'),
  ARRAY['dalle', 'midjourney'],
  'dalle',
  'Combines conversion optimization with modern design trends for maximum impact',
  'Professional hero illustration that enhances website conversion rates and user engagement.',
  'intermediate',
  true,
  true,
  4.4,
  78,
  145,
  'WebDesigner'
);

-- Insert contextual ratings for new prompts
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
-- LinkedIn Post Generator
(
  (SELECT id FROM prompts WHERE title = 'LinkedIn Post Generator'),
  'chatgpt',
  'Professional Networking',
  5,
  4,
  4,
  'Perfect for building thought leadership. My engagement increased 300% using this template.',
  true
),
(
  (SELECT id FROM prompts WHERE title = 'LinkedIn Post Generator'),
  'claude',
  'Content Marketing',
  4,
  5,
  4,
  'Great structure but Claude sometimes makes posts too formal. Still very effective.',
  true
),

-- Customer Persona Builder
(
  (SELECT id FROM prompts WHERE title = 'Customer Persona Builder'),
  'chatgpt',
  'Marketing Strategy',
  5,
  5,
  4,
  'Incredibly detailed personas that transformed our marketing campaigns. ROI improved significantly.',
  true
),

-- Sales Objection Handler
(
  (SELECT id FROM prompts WHERE title = 'Sales Objection Handler'),
  'chatgpt',
  'Sales Training',
  5,
  4,
  3,
  'These scripts feel natural and actually work. Closed 40% more deals after implementing.',
  true
),

-- Blog Post Outline Generator
(
  (SELECT id FROM prompts WHERE title = 'Blog Post Outline Generator'),
  'chatgpt',
  'Content Creation',
  4,
  5,
  4,
  'Saves hours of planning. The SEO optimization suggestions are particularly valuable.',
  true
),

-- YouTube Video Script Writer
(
  (SELECT id FROM prompts WHERE title = 'YouTube Video Script Writer'),
  'chatgpt',
  'Video Content',
  5,
  4,
  5,
  'My watch time increased 60% using these script structures. The engagement hooks work perfectly.',
  true
),

-- API Documentation Generator
(
  (SELECT id FROM prompts WHERE title = 'API Documentation Generator'),
  'chatgpt',
  'Technical Writing',
  5,
  5,
  3,
  'Finally, API docs that developers actually understand. Reduced support tickets by 50%.',
  true
),

-- Database Schema Designer
(
  (SELECT id FROM prompts WHERE title = 'Database Schema Designer'),
  'claude',
  'Database Design',
  5,
  5,
  4,
  'Claude excels at database design. The performance considerations saved us from major issues.',
  true
),

-- React Component Builder
(
  (SELECT id FROM prompts WHERE title = 'React Component Builder'),
  'chatgpt',
  'Frontend Development',
  5,
  4,
  4,
  'Production-ready components with proper TypeScript. Accelerated our development significantly.',
  true
),

-- Competitive Analysis Framework
(
  (SELECT id FROM prompts WHERE title = 'Competitive Analysis Framework'),
  'claude',
  'Business Strategy',
  5,
  5,
  4,
  'Most comprehensive competitive analysis I''ve seen. Identified opportunities we completely missed.',
  true
),

-- Financial Model Builder
(
  (SELECT id FROM prompts WHERE title = 'Financial Model Builder'),
  'claude',
  'Financial Planning',
  5,
  5,
  4,
  'Investor-grade financial models. Helped us raise Series A with confidence.',
  true
),

-- Brand Identity Designer
(
  (SELECT id FROM prompts WHERE title = 'Brand Identity Designer'),
  'chatgpt',
  'Brand Development',
  4,
  4,
  5,
  'Comprehensive brand package that our design team loved. Saved months of brand development.',
  true
),

-- UX Research Plan
(
  (SELECT id FROM prompts WHERE title = 'UX Research Plan'),
  'claude',
  'User Research',
  5,
  5,
  4,
  'Methodical approach that generated actionable insights. Our product decisions are now data-driven.',
  true
),

-- Course Curriculum Designer
(
  (SELECT id FROM prompts WHERE title = 'Course Curriculum Designer'),
  'chatgpt',
  'Educational Design',
  4,
  5,
  4,
  'Well-structured curriculum that students love. Completion rates increased 80%.',
  true
),

-- Performance Review Template
(
  (SELECT id FROM prompts WHERE title = 'Performance Review Template'),
  'chatgpt',
  'HR Management',
  4,
  5,
  3,
  'Fair and comprehensive review process. Employee satisfaction with reviews improved dramatically.',
  true
),

-- Minimalist Logo Design
(
  (SELECT id FROM prompts WHERE title = 'Minimalist Logo Design'),
  'dalle',
  'Logo Design',
  4,
  4,
  5,
  'Clean, professional logos that scale perfectly. Clients love the minimalist aesthetic.',
  true
),

-- Social Media Graphics
(
  (SELECT id FROM prompts WHERE title = 'Social Media Graphics'),
  'dalle',
  'Social Media Design',
  4,
  4,
  4,
  'Eye-catching graphics that boost engagement. Perfect for Instagram and LinkedIn posts.',
  true
),

-- Website Hero Section
(
  (SELECT id FROM prompts WHERE title = 'Website Hero Section'),
  'dalle',
  'Web Design',
  4,
  4,
  5,
  'Professional illustrations that convert. Our landing page conversion rate doubled.',
  true
);

-- Insert tags for new prompts
INSERT INTO prompt_tags (prompt_id, tag) VALUES
-- LinkedIn Post Generator
((SELECT id FROM prompts WHERE title = 'LinkedIn Post Generator'), 'linkedin'),
((SELECT id FROM prompts WHERE title = 'LinkedIn Post Generator'), 'professional-networking'),
((SELECT id FROM prompts WHERE title = 'LinkedIn Post Generator'), 'thought-leadership'),
((SELECT id FROM prompts WHERE title = 'LinkedIn Post Generator'), 'engagement'),

-- Customer Persona Builder
((SELECT id FROM prompts WHERE title = 'Customer Persona Builder'), 'customer-research'),
((SELECT id FROM prompts WHERE title = 'Customer Persona Builder'), 'marketing-strategy'),
((SELECT id FROM prompts WHERE title = 'Customer Persona Builder'), 'target-audience'),
((SELECT id FROM prompts WHERE title = 'Customer Persona Builder'), 'market-research'),

-- Sales Objection Handler
((SELECT id FROM prompts WHERE title = 'Sales Objection Handler'), 'sales-training'),
((SELECT id FROM prompts WHERE title = 'Sales Objection Handler'), 'objection-handling'),
((SELECT id FROM prompts WHERE title = 'Sales Objection Handler'), 'consultative-selling'),
((SELECT id FROM prompts WHERE title = 'Sales Objection Handler'), 'closing-techniques'),

-- Blog Post Outline Generator
((SELECT id FROM prompts WHERE title = 'Blog Post Outline Generator'), 'content-planning'),
((SELECT id FROM prompts WHERE title = 'Blog Post Outline Generator'), 'seo-optimization'),
((SELECT id FROM prompts WHERE title = 'Blog Post Outline Generator'), 'blog-writing'),
((SELECT id FROM prompts WHERE title = 'Blog Post Outline Generator'), 'content-strategy'),

-- YouTube Video Script Writer
((SELECT id FROM prompts WHERE title = 'YouTube Video Script Writer'), 'video-scripting'),
((SELECT id FROM prompts WHERE title = 'YouTube Video Script Writer'), 'youtube-optimization'),
((SELECT id FROM prompts WHERE title = 'YouTube Video Script Writer'), 'content-creation'),
((SELECT id FROM prompts WHERE title = 'YouTube Video Script Writer'), 'engagement'),

-- Email Newsletter Template
((SELECT id FROM prompts WHERE title = 'Email Newsletter Template'), 'email-marketing'),
((SELECT id FROM prompts WHERE title = 'Email Newsletter Template'), 'newsletter-design'),
((SELECT id FROM prompts WHERE title = 'Email Newsletter Template'), 'subscriber-engagement'),
((SELECT id FROM prompts WHERE title = 'Email Newsletter Template'), 'content-curation'),

-- API Documentation Generator
((SELECT id FROM prompts WHERE title = 'API Documentation Generator'), 'technical-writing'),
((SELECT id FROM prompts WHERE title = 'API Documentation Generator'), 'developer-experience'),
((SELECT id FROM prompts WHERE title = 'API Documentation Generator'), 'documentation'),
((SELECT id FROM prompts WHERE title = 'API Documentation Generator'), 'api-design'),

-- Database Schema Designer
((SELECT id FROM prompts WHERE title = 'Database Schema Designer'), 'database-design'),
((SELECT id FROM prompts WHERE title = 'Database Schema Designer'), 'data-modeling'),
((SELECT id FROM prompts WHERE title = 'Database Schema Designer'), 'performance-optimization'),
((SELECT id FROM prompts WHERE title = 'Database Schema Designer'), 'scalability'),

-- React Component Builder
((SELECT id FROM prompts WHERE title = 'React Component Builder'), 'react-development'),
((SELECT id FROM prompts WHERE title = 'React Component Builder'), 'component-design'),
((SELECT id FROM prompts WHERE title = 'React Component Builder'), 'typescript'),
((SELECT id FROM prompts WHERE title = 'React Component Builder'), 'frontend-development'),

-- Competitive Analysis Framework
((SELECT id FROM prompts WHERE title = 'Competitive Analysis Framework'), 'competitive-intelligence'),
((SELECT id FROM prompts WHERE title = 'Competitive Analysis Framework'), 'market-analysis'),
((SELECT id FROM prompts WHERE title = 'Competitive Analysis Framework'), 'strategic-planning'),
((SELECT id FROM prompts WHERE title = 'Competitive Analysis Framework'), 'business-intelligence'),

-- Financial Model Builder
((SELECT id FROM prompts WHERE title = 'Financial Model Builder'), 'financial-modeling'),
((SELECT id FROM prompts WHERE title = 'Financial Model Builder'), 'business-planning'),
((SELECT id FROM prompts WHERE title = 'Financial Model Builder'), 'fundraising'),
((SELECT id FROM prompts WHERE title = 'Financial Model Builder'), 'investment-analysis'),

-- Brand Identity Designer
((SELECT id FROM prompts WHERE title = 'Brand Identity Designer'), 'brand-strategy'),
((SELECT id FROM prompts WHERE title = 'Brand Identity Designer'), 'visual-identity'),
((SELECT id FROM prompts WHERE title = 'Brand Identity Designer'), 'brand-guidelines'),
((SELECT id FROM prompts WHERE title = 'Brand Identity Designer'), 'brand-development'),

-- UX Research Plan
((SELECT id FROM prompts WHERE title = 'UX Research Plan'), 'user-research'),
((SELECT id FROM prompts WHERE title = 'UX Research Plan'), 'research-methodology'),
((SELECT id FROM prompts WHERE title = 'UX Research Plan'), 'user-insights'),
((SELECT id FROM prompts WHERE title = 'UX Research Plan'), 'product-development'),

-- Course Curriculum Designer
((SELECT id FROM prompts WHERE title = 'Course Curriculum Designer'), 'instructional-design'),
((SELECT id FROM prompts WHERE title = 'Course Curriculum Designer'), 'online-learning'),
((SELECT id FROM prompts WHERE title = 'Course Curriculum Designer'), 'curriculum-development'),
((SELECT id FROM prompts WHERE title = 'Course Curriculum Designer'), 'educational-strategy'),

-- Performance Review Template
((SELECT id FROM prompts WHERE title = 'Performance Review Template'), 'performance-management'),
((SELECT id FROM prompts WHERE title = 'Performance Review Template'), 'employee-development'),
((SELECT id FROM prompts WHERE title = 'Performance Review Template'), 'hr-processes'),
((SELECT id FROM prompts WHERE title = 'Performance Review Template'), 'feedback-systems'),

-- Minimalist Logo Design
((SELECT id FROM prompts WHERE title = 'Minimalist Logo Design'), 'logo-design'),
((SELECT id FROM prompts WHERE title = 'Minimalist Logo Design'), 'minimalist-design'),
((SELECT id FROM prompts WHERE title = 'Minimalist Logo Design'), 'brand-identity'),
((SELECT id FROM prompts WHERE title = 'Minimalist Logo Design'), 'visual-branding'),

-- Social Media Graphics
((SELECT id FROM prompts WHERE title = 'Social Media Graphics'), 'graphic-design'),
((SELECT id FROM prompts WHERE title = 'Social Media Graphics'), 'instagram-design'),
((SELECT id FROM prompts WHERE title = 'Social Media Graphics'), 'visual-content'),
((SELECT id FROM prompts WHERE title = 'Social Media Graphics'), 'brand-consistency'),

-- Website Hero Section
((SELECT id FROM prompts WHERE title = 'Website Hero Section'), 'web-design'),
((SELECT id FROM prompts WHERE title = 'Website Hero Section'), 'hero-illustrations'),
((SELECT id FROM prompts WHERE title = 'Website Hero Section'), 'conversion-optimization'),
((SELECT id FROM prompts WHERE title = 'Website Hero Section'), 'landing-page-design');

-- Insert quality indicators for featured prompts
INSERT INTO quality_indicators (prompt_id, indicator_type, indicator_value) VALUES
-- Featured prompts
((SELECT id FROM prompts WHERE title = 'Customer Persona Builder'), 'expert_reviewed', 'Marketing Strategy Expert'),
((SELECT id FROM prompts WHERE title = 'Customer Persona Builder'), 'tested', 'Used by 500+ marketing teams'),

((SELECT id FROM prompts WHERE title = 'Competitive Analysis Framework'), 'expert_reviewed', 'Strategy Consultant'),
((SELECT id FROM prompts WHERE title = 'Competitive Analysis Framework'), 'community_favorite', 'Most comprehensive analysis framework'),

((SELECT id FROM prompts WHERE title = 'Database Schema Designer'), 'expert_reviewed', 'Senior Database Architect'),
((SELECT id FROM prompts WHERE title = 'Database Schema Designer'), 'tested', 'Production-tested schemas'),

((SELECT id FROM prompts WHERE title = 'Financial Model Builder'), 'expert_reviewed', 'Financial Analyst'),
((SELECT id FROM prompts WHERE title = 'Financial Model Builder'), 'tested', 'Investor-approved models'),

((SELECT id FROM prompts WHERE title = 'Brand Identity Designer'), 'expert_reviewed', 'Brand Strategy Expert'),
((SELECT id FROM prompts WHERE title = 'Brand Identity Designer'), 'community_favorite', 'Top branding prompt'),

((SELECT id FROM prompts WHERE title = 'UX Research Plan'), 'expert_reviewed', 'UX Research Lead'),
((SELECT id FROM prompts WHERE title = 'UX Research Plan'), 'tested', 'Research-validated methodology'),

((SELECT id FROM prompts WHERE title = 'Course Curriculum Designer'), 'expert_reviewed', 'Instructional Design Expert'),
((SELECT id FROM prompts WHERE title = 'Course Curriculum Designer'), 'tested', 'High completion rate courses'),

((SELECT id FROM prompts WHERE title = 'Minimalist Logo Design'), 'expert_reviewed', 'Professional Designer'),
((SELECT id FROM prompts WHERE title = 'Minimalist Logo Design'), 'community_favorite', 'Most used logo prompt'),

((SELECT id FROM prompts WHERE title = 'Website Hero Section'), 'expert_reviewed', 'Web Design Expert'),
((SELECT id FROM prompts WHERE title = 'Website Hero Section'), 'tested', 'Conversion-optimized designs');