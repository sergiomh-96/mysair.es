-- Add CoeficienteKp column to diffusers table
ALTER TABLE diffusers
ADD COLUMN coeficiente_kp DECIMAL(10, 4);

-- Update existing records with example CoeficienteKp values
-- Circular diffusers typically have Kp between 0.8-1.2
UPDATE diffusers SET coeficiente_kp = 0.95 WHERE modelo_difusor = 'Difusor Circular' AND referencia LIKE 'DC-%';

-- Square diffusers typically have Kp between 1.0-1.5
UPDATE diffusers SET coeficiente_kp = 1.20 WHERE modelo_difusor = 'Difusor Cuadrado' AND referencia LIKE 'DQ-%';

-- Rectangular diffusers typically have Kp between 1.2-1.8
UPDATE diffusers SET coeficiente_kp = 1.45 WHERE modelo_difusor = 'Difusor Rectangular' AND referencia LIKE 'DR-%';

-- Linear diffusers typically have Kp between 1.5-2.5
UPDATE diffusers SET coeficiente_kp = 1.85 WHERE modelo_difusor = 'Difusor Lineal' AND referencia LIKE 'DL-%';
