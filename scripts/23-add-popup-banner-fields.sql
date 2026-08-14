-- Add show_as_popup, show_as_banner, and link_url fields to popup_notifications table
ALTER TABLE popup_notifications
ADD COLUMN IF NOT EXISTS show_as_popup BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_as_banner BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS link_url VARCHAR(500);

-- Ensure default values for existing records
UPDATE popup_notifications
SET show_as_popup = true
WHERE show_as_popup IS NULL;

UPDATE popup_notifications
SET show_as_banner = false
WHERE show_as_banner IS NULL;
