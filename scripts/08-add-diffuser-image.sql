-- Add image_url column to diffusers table
ALTER TABLE diffusers
ADD COLUMN image_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN diffusers.image_url IS 'URL de la imagen del difusor almacenada en Vercel Blob Storage';

-- Update existing records with placeholder image URLs
-- These should be replaced with actual product images
UPDATE diffusers
SET image_url = '/placeholder.svg?height=200&width=200&query=' || modelo_difusor
WHERE image_url IS NULL;

-- Create index for better query performance
CREATE INDEX idx_diffusers_image_url ON diffusers(image_url) WHERE image_url IS NOT NULL;
