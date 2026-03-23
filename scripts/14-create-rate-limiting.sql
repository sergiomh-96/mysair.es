-- Create table to track contact form submissions by IP
CREATE TABLE IF NOT EXISTS contact_rate_limit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  last_attempt_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster IP lookups
CREATE INDEX IF NOT EXISTS idx_contact_rate_limit_ip ON contact_rate_limit(ip_address);
CREATE INDEX IF NOT EXISTS idx_contact_rate_limit_first_attempt ON contact_rate_limit(first_attempt_at);

-- Create table to track blocked IPs
CREATE TABLE IF NOT EXISTS blocked_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  blocked_at TIMESTAMPTZ DEFAULT NOW(),
  blocked_until TIMESTAMPTZ NOT NULL,
  reason TEXT DEFAULT 'Rate limit exceeded'
);

-- Create index for faster blocked IP lookups
CREATE INDEX IF NOT EXISTS idx_blocked_ips_address ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_until ON blocked_ips(blocked_until);

-- Enable RLS
ALTER TABLE contact_rate_limit ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role can manage rate limits" ON contact_rate_limit FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage blocked IPs" ON blocked_ips FOR ALL TO service_role USING (true);
