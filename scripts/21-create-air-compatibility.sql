-- Create table for AC unit compatibility
CREATE TABLE IF NOT EXISTS air_compatibility (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  indoor_unit_ref VARCHAR(255) NOT NULL,
  gateway_ref VARCHAR(100) NOT NULL, -- pasarela CTOTAL
  connector VARCHAR(100),
  manual_url TEXT,
  observations TEXT,
  gateway_image_url TEXT,
  remote_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE air_compatibility ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON air_compatibility
  FOR SELECT USING (true);

-- Create policy to allow authenticated users (admins) to manage the data
CREATE POLICY "Allow authenticated users to manage data" ON air_compatibility
  FOR ALL TO authenticated USING (true);

-- Create indexes for searching
CREATE INDEX IF NOT EXISTS idx_air_compatibility_brand ON air_compatibility(brand);
CREATE INDEX IF NOT EXISTS idx_air_compatibility_ref ON air_compatibility(indoor_unit_ref);
CREATE INDEX IF NOT EXISTS idx_air_compatibility_brand_ref ON air_compatibility(brand, indoor_unit_ref);
