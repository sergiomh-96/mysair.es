-- Add product options fields to products table
-- This script adds colors, variants, and dimensions fields to store product options

-- Add colors field (JSON array to store color options)
ALTER TABLE products 
ADD COLUMN colors JSONB DEFAULT '[]'::jsonb;

-- Add variants field (JSON array to store variant options)
ALTER TABLE products 
ADD COLUMN variants JSONB DEFAULT '[]'::jsonb;

-- Add dimensions field (JSON array to store dimension options)
ALTER TABLE products 
ADD COLUMN dimensions JSONB DEFAULT '[]'::jsonb;

-- Add comments to document the new fields
COMMENT ON COLUMN products.colors IS 'JSON array of color options for the product. Example: [{"name": "Blanco", "code": "#FFFFFF"}, {"name": "Negro", "code": "#000000"}]';
COMMENT ON COLUMN products.variants IS 'JSON array of variant options for the product. Example: [{"name": "Estándar", "description": "Modelo básico"}, {"name": "Premium", "description": "Modelo con características avanzadas"}]';
COMMENT ON COLUMN products.dimensions IS 'JSON array of dimension options for the product. Example: [{"name": "200x100mm", "width": 200, "height": 100}, {"name": "300x150mm", "width": 300, "height": 150}]';

-- Update some sample products with example data
UPDATE products 
SET 
  colors = '[
    {"name": "Blanco", "code": "#FFFFFF"},
    {"name": "Negro", "code": "#000000"},
    {"name": "Gris", "code": "#808080"}
  ]'::jsonb,
  variants = '[
    {"name": "Estándar", "description": "Modelo básico"},
    {"name": "Premium", "description": "Con características avanzadas"}
  ]'::jsonb,
  dimensions = '[
    {"name": "200x100mm", "width": 200, "height": 100, "unit": "mm"},
    {"name": "300x150mm", "width": 300, "height": 150, "unit": "mm"},
    {"name": "400x200mm", "width": 400, "height": 200, "unit": "mm"}
  ]'::jsonb
WHERE category = 'air_diffusion' AND id <= 3;

-- Update VMC products with different options
UPDATE products 
SET 
  colors = '[
    {"name": "Blanco", "code": "#FFFFFF"},
    {"name": "Plata", "code": "#C0C0C0"}
  ]'::jsonb,
  variants = '[
    {"name": "Básico", "description": "Funcionalidades estándar"},
    {"name": "Avanzado", "description": "Con control inteligente"},
    {"name": "Pro", "description": "Máximas prestaciones"}
  ]'::jsonb,
  dimensions = '[
    {"name": "Compacto", "width": 150, "height": 100, "depth": 50, "unit": "mm"},
    {"name": "Estándar", "width": 200, "height": 150, "depth": 75, "unit": "mm"},
    {"name": "Grande", "width": 300, "height": 200, "depth": 100, "unit": "mm"}
  ]'::jsonb
WHERE category = 'vmc';

-- Create indexes for better performance when filtering by options
CREATE INDEX IF NOT EXISTS idx_products_colors ON products USING GIN (colors);
CREATE INDEX IF NOT EXISTS idx_products_variants ON products USING GIN (variants);
CREATE INDEX IF NOT EXISTS idx_products_dimensions ON products USING GIN (dimensions);
