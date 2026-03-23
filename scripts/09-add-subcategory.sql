-- Add subcategory column to diffusers table
ALTER TABLE diffusers ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Update existing records with appropriate subcategories based on modelo_difusor
UPDATE diffusers SET subcategory = 'Rejillas' WHERE LOWER(modelo_difusor) LIKE '%rejilla%';
UPDATE diffusers SET subcategory = 'Difusores lineales' WHERE LOWER(modelo_difusor) LIKE '%lineal%';
UPDATE diffusers SET subcategory = 'Difusores circulares' WHERE LOWER(modelo_difusor) LIKE '%circular%';
UPDATE diffusers SET subcategory = 'Difusores cuadrados' WHERE LOWER(modelo_difusor) LIKE '%cuadrado%';
UPDATE diffusers SET subcategory = 'Difusores Rotacionales' WHERE LOWER(modelo_difusor) LIKE '%rotacional%';
UPDATE diffusers SET subcategory = 'Difusores Radiales' WHERE LOWER(modelo_difusor) LIKE '%radial%';
UPDATE diffusers SET subcategory = 'Multitoberas' WHERE LOWER(modelo_difusor) LIKE '%multitobera%';
UPDATE diffusers SET subcategory = 'Toberas' WHERE LOWER(modelo_difusor) LIKE '%tobera%' AND LOWER(modelo_difusor) NOT LIKE '%multi%';
UPDATE diffusers SET subcategory = 'Compuertas' WHERE LOWER(modelo_difusor) LIKE '%compuerta%';

-- Create index on subcategory for better query performance
CREATE INDEX IF NOT EXISTS idx_diffusers_subcategory ON diffusers(subcategory);

-- Display updated records
SELECT id, modelo_difusor, subcategory FROM diffusers ORDER BY subcategory;
