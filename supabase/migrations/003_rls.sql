-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_networks ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/update their own
CREATE POLICY "users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- All tables: authenticated users can read
CREATE POLICY "authenticated can read clients" ON clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can read pages" ON pages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can read campaigns" ON campaigns FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can read campaign_pages" ON campaign_pages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can read payments" ON payments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can read payment_networks" ON payment_networks FOR SELECT USING (auth.role() = 'authenticated');

-- Admins can write to all tables
CREATE POLICY "admins can write clients" ON clients FOR ALL USING (is_admin());
CREATE POLICY "admins can write pages" ON pages FOR ALL USING (is_admin());
CREATE POLICY "admins can write campaigns" ON campaigns FOR ALL USING (is_admin());
CREATE POLICY "admins can write campaign_pages" ON campaign_pages FOR ALL USING (is_admin());
CREATE POLICY "admins can write payments" ON payments FOR ALL USING (is_admin());
CREATE POLICY "admins can write payment_networks" ON payment_networks FOR ALL USING (is_admin());
