-- Add manual ordering field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for better performance on ordering
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

-- Update existing products with default sort order based on current order
-- This will maintain current ordering while allowing manual adjustments
UPDATE products 
SET sort_order = subquery.row_number 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY is_featured DESC, name ASC) as row_number
  FROM products
) AS subquery 
WHERE products.id = subquery.id;
