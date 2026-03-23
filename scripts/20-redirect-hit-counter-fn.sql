-- Function to increment hit counter safely
CREATE OR REPLACE FUNCTION increment_redirect_hits(path text)
RETURNS void AS $$
  UPDATE url_redirects
  SET hit_count = hit_count + 1, updated_at = now()
  WHERE source_path = path AND is_active = true;
$$ LANGUAGE sql;
