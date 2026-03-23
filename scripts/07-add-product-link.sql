-- Add product_slug column to diffusers table
ALTER TABLE diffusers
ADD COLUMN product_slug TEXT;

-- Add some example product slugs for existing diffusers
-- These should match the slugs of actual products in your products table
UPDATE diffusers
SET product_slug = CASE
  WHEN modelo_difusor LIKE '%Circular%' THEN 'difusor-circular-dc'
  WHEN modelo_difusor LIKE '%Cuadrado%' THEN 'difusor-cuadrado-dq'
  WHEN modelo_difusor LIKE '%Rectangular%' THEN 'difusor-rectangular-dr'
  WHEN modelo_difusor LIKE '%Lineal%' THEN 'difusor-lineal-dl'
  ELSE NULL
END;

-- Add index for better query performance
CREATE INDEX idx_diffusers_product_slug ON diffusers(product_slug);
