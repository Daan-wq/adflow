ALTER TABLE pages
  ADD COLUMN IF NOT EXISTS page_link TEXT,
  ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'instagram',
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS audience_country_pct JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS analytic_proof_url TEXT;

CREATE INDEX IF NOT EXISTS idx_pages_platform ON pages(platform);
CREATE INDEX IF NOT EXISTS idx_pages_country ON pages(country);
