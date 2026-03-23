-- Add technical documentation fields to products table
ALTER TABLE products 
ADD COLUMN ficha_tecnica_url TEXT,
ADD COLUMN manual_usuario_url TEXT,
ADD COLUMN manual_instalador_url TEXT,
ADD COLUMN cad_url TEXT,
ADD COLUMN bim_url TEXT;

-- Update some sample products with documentation URLs (optional)
UPDATE products 
SET 
  ficha_tecnica_url = 'https://example.com/ficha-tecnica.pdf',
  manual_usuario_url = 'https://example.com/manual-usuario.pdf',
  manual_instalador_url = 'https://example.com/manual-instalador.pdf',
  cad_url = 'https://example.com/archivo.dwg',
  bim_url = 'https://example.com/modelo.rvt'
WHERE id IN (1, 2, 3);
