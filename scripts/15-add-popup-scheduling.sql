-- Add scheduling and frequency fields to popup_notifications table
ALTER TABLE popup_notifications
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS max_views INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS interval_minutes INTEGER DEFAULT 0;

-- Add session identifier to viewed_popups to track user sessions
ALTER TABLE viewed_popups
ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);

-- Update existing popup to have no date restrictions
UPDATE popup_notifications
SET start_date = NULL,
    end_date = NULL,
    max_views = 1,
    interval_minutes = 0
WHERE start_date IS NULL;
