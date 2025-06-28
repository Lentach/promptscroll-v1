# PromptScroll Deployment Guide 🚀

This guide covers deploying PromptScroll to production with Vercel and Supabase.

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation

- [ ] All features implemented and tested
- [ ] TypeScript compilation successful (`npm run type-check`)
- [ ] ESLint checks passing (`npm run lint`)
- [ ] Build process successful (`npm run build`)
- [ ] Environment variables configured

### ✅ Database Preparation

- [ ] Production Supabase project created
- [ ] All migrations applied in correct order
- [ ] Row Level Security (RLS) policies configured
- [ ] Seed data loaded (optional)
- [ ] Database performance optimized

### ✅ Performance Optimization

- [ ] Images optimized and properly configured
- [ ] Bundle size analyzed and optimized
- [ ] Loading performance <3 seconds
- [ ] Lighthouse scores >90

## 🗄️ Database Setup

### 1. Create Production Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and set project details:
   - **Name**: `promptscroll-production`
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your users
4. Wait for project initialization (~2 minutes)

### 2. Apply Database Migrations

Run migrations in this exact order:

```sql
-- 1. First migration: Core schema
-- Copy content from: supabase/migrations/20250621032923_flat_unit.sql

-- 2. Second migration: Seed categories and sample data
-- Copy content from: supabase/migrations/20250621032951_round_surf.sql

-- 3. Third migration: Quality seed data
-- Copy content from: supabase/migrations/20250621033001_seed_quality_data.sql
```

### 3. Configure Row Level Security

Verify RLS policies are active:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Verify policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 4. Get Database Credentials

From your Supabase project dashboard:

- **Project URL**: `https://[project-id].supabase.co`
- **Anon Key**: Found in Settings > API
- **Service Role Key**: Found in Settings > API (keep secure!)

### 5. Configure Auth Redirect URLs

Supabase ➜ Authentication ➜ URL Configuration:

| Setting | Value |
|---------|-------|
| Site URL | https://your-domain.vercel.app |
| Additional Redirect URLs | https://your-domain.vercel.app/login,
https://your-domain.vercel.app/register,
https://your-domain.vercel.app/forgot-password,
https://your-domain.vercel.app/verify-email |

> ℹ️  If you also run a staging environment, add its domain(s) here as well (e.g. `https://promptscroll-staging.vercel.app`).

Remember to **click "Save"** after updating. Changes take effect immediately.

## 🚀 Vercel Deployment

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your PromptScroll repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 2. Environment Variables

Add these environment variables in Vercel:

```env
# Required - Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Required - Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=PromptScroll

# Optional - Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional - Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true

# Production Environment
NODE_ENV=production
```

### 3. Deploy

1. Click "Deploy" in Vercel
2. Wait for build completion (~2-3 minutes)
3. Verify deployment at provided URL
4. Test core functionality:
   - [ ] Homepage loads correctly
   - [ ] Prompts display with data
   - [ ] Search and filtering work
   - [ ] Prompt submission works
   - [ ] Rating system functions

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

### 2. Performance Monitoring

Set up monitoring for:

- **Core Web Vitals**: Monitor in Vercel Analytics
- **Error Tracking**: Configure error reporting
- **Database Performance**: Monitor in Supabase dashboard
- **API Response Times**: Track in Vercel Functions

### 3. Security Configuration

#### Supabase Security

```sql
-- Verify RLS policies are restrictive enough
-- Check for any overly permissive policies

-- Example: Ensure users can only modify their own data
SELECT * FROM pg_policies WHERE policyname LIKE '%public%';
```

#### Vercel Security Headers

Already configured in `next.config.js`:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: Restricted camera/microphone/geolocation

## 📊 Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prompts_quality_created
ON prompts(quality_score DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prompts_category_quality
ON prompts(category_id, quality_score DESC);

CREATE INDEX IF NOT EXISTS idx_contextual_ratings_prompt_model
ON contextual_ratings(prompt_id, model_used);
```

### 2. Caching Strategy

- **Static Assets**: Cached by Vercel CDN
- **API Routes**: Implement caching headers
- **Database Queries**: Use Supabase query caching
- **Images**: Optimized by Next.js Image component

### 3. Bundle Optimization

```bash
# Analyze bundle size
npm run build:analyze

# Check for large dependencies
npx bundle-analyzer .next/static/chunks/*.js
```

## 🔍 Testing Production Deployment

### 1. Functional Testing

- [ ] All pages load correctly
- [ ] Database connections work
- [ ] User interactions function
- [ ] Error handling works
- [ ] Mobile responsiveness

### 2. Performance Testing

- [ ] Lighthouse score >90
- [ ] Core Web Vitals pass
- [ ] Loading time <3 seconds
- [ ] Database queries optimized

### 3. Security Testing

- [ ] RLS policies enforced
- [ ] No sensitive data exposed
- [ ] HTTPS enforced
- [ ] Security headers present

## 🚨 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check TypeScript errors
npm run type-check

# Check for missing dependencies
npm install

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

#### Database Connection Issues

```javascript
// Test Supabase connection
import { supabase } from './lib/supabase';

const testConnection = async () => {
  const { data, error } = await supabase.from('categories').select('count').limit(1);

  console.log('Connection test:', { data, error });
};
```

#### Performance Issues

- Check database query performance in Supabase dashboard
- Analyze bundle size with Vercel analytics
- Monitor Core Web Vitals in production

### Getting Help

1. **Vercel Issues**: Check Vercel documentation and support
2. **Supabase Issues**: Check Supabase documentation and Discord
3. **Application Issues**: Check application logs in Vercel dashboard

## 📈 Monitoring and Maintenance

### 1. Regular Monitoring

- **Weekly**: Check performance metrics and error rates
- **Monthly**: Review database performance and optimize queries
- **Quarterly**: Update dependencies and security patches

### 2. Backup Strategy

- **Database**: Supabase provides automatic backups
- **Code**: Repository is backed up on GitHub
- **Environment**: Document all configuration

### 3. Scaling Considerations

- **Database**: Monitor connection limits and query performance
- **Vercel**: Upgrade plan if needed for higher traffic
- **CDN**: Consider additional CDN for global performance

---

## 🎉 Deployment Complete!

Your PromptScroll application is now live and ready for users. Monitor the deployment and gather user feedback for continuous improvement.

**Next Steps:**

1. Share with initial users for feedback
2. Monitor performance and fix any issues
3. Plan feature updates and improvements
4. Consider marketing and user acquisition strategies

**Production URL**: `https://your-domain.vercel.app`
**Admin Dashboard**: Supabase Dashboard for database management
**Analytics**: Vercel Analytics for performance monitoring
