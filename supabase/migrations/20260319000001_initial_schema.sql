-- Profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  communication_channel TEXT NOT NULL DEFAULT 'whatsapp',
  communication_handle TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  total_spent DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL,
  niche TEXT,
  follower_count INTEGER,
  avg_engagement_rate DECIMAL(5,2),
  avg_cpm DECIMAL(8,2),
  communication_channel TEXT NOT NULL DEFAULT 'instagram',
  communication_handle TEXT,
  contact_name TEXT,
  payment_method TEXT,
  payment_details TEXT,
  reliability_score INTEGER DEFAULT 5,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  status TEXT NOT NULL DEFAULT 'draft',
  client_pays DECIMAL(12,2) NOT NULL,
  total_page_cost DECIMAL(12,2) DEFAULT 0,
  your_margin DECIMAL(12,2) GENERATED ALWAYS AS (client_pays - total_page_cost) STORED,
  start_date DATE,
  end_date DATE,
  ad_content_url TEXT,
  ad_caption TEXT,
  ad_link TEXT,
  total_reach INTEGER,
  total_impressions INTEGER,
  total_clicks INTEGER,
  total_conversions INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Campaign Pages
CREATE TABLE campaign_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id),
  cost DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  scheduled_date DATE,
  posted_at TIMESTAMPTZ,
  reach INTEGER,
  impressions INTEGER,
  clicks INTEGER,
  screenshot_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direction TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  page_id UUID REFERENCES pages(id),
  campaign_id UUID REFERENCES campaigns(id),
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  payment_method TEXT,
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payment Networks
CREATE TABLE payment_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  account_label TEXT NOT NULL,
  currency TEXT DEFAULT 'EUR',
  balance DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaign_pages_campaign_id ON campaign_pages(campaign_id);
CREATE INDEX idx_campaign_pages_page_id ON campaign_pages(page_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_page_id ON payments(page_id);
CREATE INDEX idx_payments_campaign_id ON payments(campaign_id);
CREATE INDEX idx_payments_status ON payments(status);
