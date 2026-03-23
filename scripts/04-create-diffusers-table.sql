-- Create diffusers table for the selection tool
CREATE TABLE IF NOT EXISTS diffusers (
  id SERIAL PRIMARY KEY,
  modelo_difusor VARCHAR(100) NOT NULL,
  referencia VARCHAR(50) NOT NULL UNIQUE,
  alto DECIMAL(10, 2) NOT NULL, -- in mm
  ancho DECIMAL(10, 2) NOT NULL, -- in mm
  area_efectiva DECIMAL(10, 4) NOT NULL, -- in m²
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster area_efectiva searches
CREATE INDEX IF NOT EXISTS idx_diffusers_area_efectiva ON diffusers(area_efectiva);

-- Removed descriptions from INSERT statements to match table columns
-- Insert sample data
INSERT INTO diffusers (modelo_difusor, referencia, alto, ancho, area_efectiva) VALUES
  ('Difusor Circular', 'DC-100', 100, 100, 0.0079),
  ('Difusor Circular', 'DC-125', 125, 125, 0.0123),
  ('Difusor Circular', 'DC-150', 150, 150, 0.0177),
  ('Difusor Circular', 'DC-200', 200, 200, 0.0314),
  ('Difusor Circular', 'DC-250', 250, 250, 0.0491),
  ('Difusor Cuadrado', 'DQ-200', 200, 200, 0.0400),
  ('Difusor Cuadrado', 'DQ-300', 300, 300, 0.0900),
  ('Difusor Cuadrado', 'DQ-400', 400, 400, 0.1600),
  ('Difusor Cuadrado', 'DQ-500', 500, 500, 0.2500),
  ('Difusor Cuadrado', 'DQ-600', 600, 600, 0.3600),
  ('Difusor Rectangular', 'DR-300x150', 300, 150, 0.0450),
  ('Difusor Rectangular', 'DR-400x200', 400, 200, 0.0800),
  ('Difusor Rectangular', 'DR-500x250', 500, 250, 0.1250),
  ('Difusor Rectangular', 'DR-600x300', 600, 300, 0.1800),
  ('Difusor Rectangular', 'DR-800x400', 800, 400, 0.3200),
  ('Difusor Lineal', 'DL-1000x100', 1000, 100, 0.1000),
  ('Difusor Lineal', 'DL-1200x100', 1200, 100, 0.1200),
  ('Difusor Lineal', 'DL-1500x100', 1500, 100, 0.1500),
  ('Difusor Lineal', 'DL-2000x100', 2000, 100, 0.2000)
ON CONFLICT (referencia) DO NOTHING;
