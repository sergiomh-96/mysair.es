-- Create contact-attachments bucket for storing contact form files
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact-attachments', 'contact-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policy to allow public read access
CREATE POLICY "Allow public read access on contact-attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'contact-attachments');

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to contact-attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'contact-attachments');

-- Allow service role to upload files (for server-side uploads)
CREATE POLICY "Allow service role uploads to contact-attachments"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'contact-attachments');
