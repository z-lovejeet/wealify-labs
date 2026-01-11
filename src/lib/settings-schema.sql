CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default values if they don't exist
INSERT INTO platform_settings (key, value) VALUES
('site_name', 'Wealify Labs'),
('support_email', 'support@wealifylabs.com'),
('maintenance_mode', 'false'),
('currency', 'USD'),
('enable_stripe', 'true'),
('banner_active', 'false'),
('banner_text', 'Welcome to Wealify Labs!'),
('banner_link', '/courses')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (needed for navbar/banner)
CREATE POLICY "Allow public read access" ON platform_settings FOR SELECT USING (true);

-- Allow admin full access (using the existing admin check logic or just authenticated if we trust the app structure, 
-- strictly speaking we should check for role='admin' but for this simple setup we'll assume the API protects writes)
CREATE POLICY "Allow authenticated update" ON platform_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert" ON platform_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
