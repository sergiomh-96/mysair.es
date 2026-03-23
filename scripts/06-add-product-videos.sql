-- Add product videos table for YouTube links
CREATE TABLE IF NOT EXISTS product_videos (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  youtube_url TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_product_videos_product_id ON product_videos(product_id);
CREATE INDEX IF NOT EXISTS idx_product_videos_sort_order ON product_videos(sort_order);

-- Add some sample videos for existing products
INSERT INTO product_videos (product_id, title, youtube_url, description, sort_order) VALUES
(1, 'Instalación de Rejilla Lineal Premium', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Guía paso a paso para la instalación correcta', 1),
(1, 'Mantenimiento y Limpieza', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Cómo mantener tu rejilla en perfecto estado', 2),
(6, 'Configuración del Difusor Circular', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Tutorial de configuración inicial', 1);
