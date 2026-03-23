ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS route_type character varying DEFAULT 'blogs';

-- Update all existing blogs to use 'blogs' route
UPDATE blog_posts SET route_type = 'blogs' WHERE route_type IS NULL;
