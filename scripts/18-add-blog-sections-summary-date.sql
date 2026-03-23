ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS sections jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz;
