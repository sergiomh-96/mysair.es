-- Add fixation_type column to products table
ALTER TABLE products 
ADD COLUMN fixation_types JSONB;

-- Add some example fixation types to existing products
UPDATE products 
SET fixation_types = '[
  {"name": "Empotrado", "description": "Instalación empotrada en techo"},
  {"name": "Superficie", "description": "Instalación en superficie"},
  {"name": "Suspendido", "description": "Instalación suspendida con cables"}
]'::jsonb
WHERE category = 'air_diffusion';

UPDATE products 
SET fixation_types = '[
  {"name": "Pared", "description": "Montaje en pared"},
  {"name": "Panel", "description": "Montaje en panel de control"},
  {"name": "Carril DIN", "description": "Montaje en carril DIN"}
]'::jsonb
WHERE category = 'smart_systems';

-- Add comment to the column
COMMENT ON COLUMN products.fixation_types IS 'JSON array of fixation type options with name and description';
