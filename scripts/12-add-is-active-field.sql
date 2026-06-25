-- Add is_active field to products table
-- Default is true so existing products remain active
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing products to be active (though DEFAULT true handles it, this is explicit)
UPDATE products SET is_active = true WHERE is_active IS NULL;
