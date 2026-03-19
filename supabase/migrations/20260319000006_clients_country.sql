ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS country TEXT;

CREATE INDEX IF NOT EXISTS idx_clients_country ON clients(country);
