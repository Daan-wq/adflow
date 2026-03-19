CREATE TABLE page_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  followers_count INTEGER,
  views_per_month INTEGER,
  reach INTEGER,
  accounts_engaged INTEGER,
  profile_visits INTEGER,
  bio_link_clicks INTEGER,
  avg_watch_time_ms INTEGER,
  likes INTEGER,
  comments INTEGER,
  saves INTEGER,
  shares INTEGER,
  engagement_rate DECIMAL(5,2),
  top_country_1 TEXT,
  top_country_pct_1 DECIMAL(5,2),
  top_country_2 TEXT,
  top_country_pct_2 DECIMAL(5,2),
  top_country_3 TEXT,
  top_country_pct_3 DECIMAL(5,2),
  age_13_17 DECIMAL(5,2),
  age_18_24 DECIMAL(5,2),
  age_25_34 DECIMAL(5,2),
  age_35_44 DECIMAL(5,2),
  age_45_54 DECIMAL(5,2),
  age_55_64 DECIMAL(5,2),
  age_65_plus DECIMAL(5,2),
  gender_male DECIMAL(5,2),
  gender_female DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_page_stats_page_id ON page_stats(page_id);
CREATE INDEX IF NOT EXISTS idx_page_stats_snapshot_date ON page_stats(snapshot_date DESC);

ALTER TABLE page_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_all" ON page_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
