# PromptScroll 🚀

> Discover, rate and share the best AI prompts for ChatGPT, Claude, DALL-E and more

PromptScroll is a community-driven platform for discovering, sharing, and rating high-quality AI prompts. Built with quality, trust, and education at its core.

## ✨ Features

### 🎯 **Quality-First Approach**

- **Contextual Ratings**: Rate prompts for specific AI models and use cases
- **Verification System**: Expert-reviewed and community-validated prompts
- **Trust Indicators**: Multi-dimensional quality scoring and badges

### 🧠 **Educational Value**

- **Prompt Analysis**: Learn why prompts work with technique breakdowns
- **Best Practices**: Integrated learning resources and optimization tips
- **Skill Building**: Progressive difficulty levels from beginner to advanced

### 🔍 **Advanced Discovery**

- **Smart Filtering**: Filter by AI model, quality, difficulty, and verification status
- **Contextual Search**: Find prompts for specific use cases and models
- **Trending Algorithm**: Discover popular and emerging prompts

### 🛡️ **Content Safety**

- **Community Moderation**: Comprehensive reporting and review system
- **Content Guidelines**: Clear standards for quality and appropriateness
- **Trust Building**: Transparent moderation and verification processes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/promptscroll.git
   cd promptscroll
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the migration files in `/supabase/migrations/` in order
   - The migrations will create tables and seed data automatically

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📊 Database Schema

### Core Tables

- `prompts` - Main prompt data with quality indicators
- `contextual_ratings` - Model-specific and use-case-specific ratings
- `categories` - Organized prompt categories
- `prompt_tags` - Flexible tagging system
- `quality_indicators` - Trust and verification signals

### Key Features

- **Row Level Security (RLS)** enabled on all tables
- **Contextual rating system** for nuanced feedback
- **Quality scoring** based on community ratings
- **Verification badges** for trusted content

## 🎨 Design System

### Colors

- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Quality Indicators**:
  - Verified: #10B981 (Green)
  - Featured: #F59E0B (Amber)
  - Expert: #8B5CF6 (Purple)
  - Community: #3B82F6 (Blue)

### Components

- **Glass Morphism**: Consistent glass-style components
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Micro-interactions and transitions
- **Accessibility**: WCAG 2.1 AA compliant

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Organization

```
├── app/                 # Next.js app directory
├── components/          # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API calls
├── types/              # TypeScript type definitions
├── supabase/           # Database migrations and config
└── public/             # Static assets
```

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Database Setup for Production

1. Create a production Supabase project
2. Run migrations in order
3. Update RLS policies if needed
4. Configure custom domain (optional)

## 📈 Performance

- **Loading Time**: <3 seconds initial load
- **Lighthouse Score**: 90+ across all metrics
- **Optimizations**:
  - Image optimization with Next.js
  - Code splitting and lazy loading
  - Efficient database queries
  - Caching strategies

## 🛡️ Security

- **Row Level Security**: Database-level access control
- **Content Moderation**: Community reporting and review
- **Input Validation**: Client and server-side validation
- **Security Headers**: Comprehensive security headers
- **HTTPS Only**: Secure connections enforced

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend platform
- **Vercel** for seamless deployment
- **Lucide** for beautiful icons
- **Tailwind CSS** for the utility-first CSS framework
- **Next.js** for the React framework

## 📞 Support

- **Documentation**: [docs.promptscroll.com](https://docs.promptscroll.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/promptscroll/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/promptscroll/discussions)

---

**Built with ❤️ for the AI community**

_PromptScroll - Where great prompts are discovered, shared, and perfected._

## AI Model Redirect Button

A reusable **RedirectButton** component lets users open any prompt in their preferred AI playground with a single click. The component automatically:

1. Copies the prompt to the clipboard.
2. Opens the playground URL for the selected model in a new browser tab.

### Adding / Updating AI models

1. Edit `src/constants/aiModels.ts` and add or modify an entry in the `AI_MODELS` object.
   ```ts
   export const AI_MODELS = {
     // ...existing
     mistral: {
       name: 'Mistral',
       url: 'https://chat.mistral.ai/',
     },
   } as const;
   ```
2. (Optional) If you need a custom icon or colour scheme, update the component(s) that render those visuals (e.g. `PromptCard.tsx`).
3. Rebuild / restart dev server.

### Using the component directly

```tsx
import { RedirectButton } from './components/RedirectButton';

<RedirectButton model="gemini" promptContent={myPrompt} className="my-classes" />;
```
