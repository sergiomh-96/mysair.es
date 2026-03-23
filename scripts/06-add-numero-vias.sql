-- Add numero_vias_ranuras_bocas column to diffusers table
ALTER TABLE diffusers 
ADD COLUMN numero_vias_ranuras_bocas INTEGER;

-- Update existing records with example values based on diffuser type
UPDATE diffusers 
SET numero_vias_ranuras_bocas = CASE 
  WHEN modelo_difusor LIKE '%Circular%' THEN 1
  WHEN modelo_difusor LIKE '%Cuadrado%' THEN 1
  WHEN modelo_difusor LIKE '%Rectangular%' THEN 2
  WHEN modelo_difusor LIKE '%Lineal%' THEN 4
  ELSE 1
END;

-- Add comment to the column
COMMENT ON COLUMN diffusers.numero_vias_ranuras_bocas IS 'Número de vías, ranuras o bocas del difusor';
