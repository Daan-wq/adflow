# Database Migrations

Run these against your Supabase project in order:

1. `001_initial_schema.sql` — Core tables + indexes
2. `002_views.sql` — Dashboard and reporting views
3. `003_rls.sql` — Row Level Security policies

## How to apply

Option A (Supabase CLI):
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Option B (Supabase SQL Editor):
Copy-paste each file in order into the SQL Editor at supabase.com/dashboard.

## After applying

Generate TypeScript types:
```bash
npx supabase gen types typescript --linked > lib/supabase/types.ts
```
