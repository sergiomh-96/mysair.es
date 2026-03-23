-- Add attachment_url column to contact_messages table
ALTER TABLE contact_messages 
ADD COLUMN attachment_url TEXT,
ADD COLUMN attachment_filename TEXT,
ADD COLUMN attachment_size INTEGER;

-- Add comment to describe the new columns
COMMENT ON COLUMN contact_messages.attachment_url IS 'URL to the uploaded file in Supabase Storage';
COMMENT ON COLUMN contact_messages.attachment_filename IS 'Original filename of the uploaded file';
COMMENT ON COLUMN contact_messages.attachment_size IS 'File size in bytes';
