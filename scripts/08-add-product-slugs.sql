-- Add slug column to products table and generate slugs for existing products
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Generate slugs for existing products based on their names
UPDATE products SET slug = 
  CASE 
    WHEN name = 'Difusor Circular Premium' THEN 'difusor-circular-premium'
    WHEN name = 'Rejilla Lineal Moderna' THEN 'rejilla-lineal-moderna'
    WHEN name = 'Sistema VMC Inteligente' THEN 'sistema-vmc-inteligente'
    WHEN name = 'Difusor de Techo Ajustable' THEN 'difusor-techo-ajustable'
    WHEN name = 'Rejilla de Retorno Elegante' THEN 'rejilla-retorno-elegante'
    WHEN name = 'Sistema de Control Climático' THEN 'sistema-control-climatico'
    WHEN name = 'Difusor de Suelo Discreto' THEN 'difusor-suelo-discreto'
    WHEN name = 'Rejilla Decorativa Premium' THEN 'rejilla-decorativa-premium'
    WHEN name = 'Sistema Domótico Avanzado' THEN 'sistemas-domoticos'
    WHEN name = 'Difusor de Aire Direccional' THEN 'difusion-aire'
    WHEN name = 'Rejilla Anti-Lluvia Exterior' THEN 'rejilla-anti-lluvia-exterior'
    WHEN name = 'Sistema VMC Residencial' THEN 'sistema-vmc-residencial'
    ELSE LOWER(REPLACE(REPLACE(REPLACE(REPLACE(name, ' ', '-'), 'á', 'a'), 'é', 'e'), 'í', 'i'))
  END
WHERE slug IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
