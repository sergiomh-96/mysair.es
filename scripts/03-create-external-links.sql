-- Create external_links table for managing catalog and tariff links
CREATE TABLE IF NOT EXISTS external_links (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'catalog' or 'tariff'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO external_links (name, description, url, type) VALUES
('Catálogo General', 'Consulta nuestro catálogo completo de productos HVAC y sistemas de climatización', 'https://example.com/catalogo.pdf', 'catalog'),
('Tarifa de Precios', 'Descarga nuestra tarifa actualizada con precios y condiciones comerciales', 'https://example.com/tarifa.pdf', 'tariff');
