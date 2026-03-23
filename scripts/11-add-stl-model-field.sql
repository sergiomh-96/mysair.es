-- Add stl_model_url field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS stl_model_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN products.stl_model_url IS 'URL to the STL 3D model file for the product';
