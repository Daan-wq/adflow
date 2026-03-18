# Deployment

## Prerequisites

1. Supabase project created and migrations applied:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   npx supabase gen types typescript --linked > lib/supabase/types.ts
   ```

2. Environment variables ready (see `.env.example`)

## Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel link
vercel --prod
```

Then add all environment variables from `.env.example` in Vercel dashboard → Settings → Environment Variables.

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `AI_MODEL` (optional, defaults to `claude-opus-4-6`)

## Post-deploy Checklist

- [ ] Login works
- [ ] Create a test client
- [ ] Create a test campaign
- [ ] Dashboard KPIs show data
- [ ] AI summary generates (requires ANTHROPIC_API_KEY)
