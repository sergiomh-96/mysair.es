-- Update products table to support multiple images
-- Change image_url from TEXT to TEXT[] to store multiple image URLs
ALTER TABLE products 
ALTER COLUMN image_url TYPE TEXT[] USING ARRAY[image_url];

-- Update existing products with multiple images
UPDATE products SET image_url = ARRAY[
  '/modern-hvac-air-conditioning-system-with-smart-con.jpg',
  '/air-diffusion-grilles-and-vents-in-modern-building.jpg',
  '/smart-home-automation-system-with-climate-control-.jpg'
] WHERE id = 1;

UPDATE products SET image_url = ARRAY[
  '/air-diffusion-grilles-and-vents-in-modern-building.jpg',
  '/modern-hvac-air-conditioning-system-with-smart-con.jpg'
] WHERE id = 2;

UPDATE products SET image_url = ARRAY[
  '/smart-home-automation-system-with-climate-control-.jpg',
  '/modern-hvac-air-conditioning-system-with-smart-con.jpg',
  '/air-diffusion-grilles-and-vents-in-modern-building.jpg'
] WHERE id = 3;

-- Update remaining products with at least one image
UPDATE products SET image_url = ARRAY[image_url[1]] WHERE array_length(image_url, 1) IS NULL;
