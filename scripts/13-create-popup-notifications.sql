-- Create popup_notifications table
CREATE TABLE IF NOT EXISTS popup_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create viewed_popups table to track which popups users have seen
CREATE TABLE IF NOT EXISTS viewed_popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  popup_id UUID NOT NULL REFERENCES popup_notifications(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on popup_notifications
ALTER TABLE popup_notifications ENABLE ROW LEVEL SECURITY;

-- Enable RLS on viewed_popups
ALTER TABLE viewed_popups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active popups
CREATE POLICY "Allow public read active popups"
ON popup_notifications FOR SELECT
USING (is_active = true);

-- Allow anyone to insert into viewed_popups
CREATE POLICY "Allow public insert viewed popups"
ON viewed_popups FOR INSERT
WITH CHECK (true);

-- Insert a sample popup for testing
INSERT INTO popup_notifications (title, description, image_url, is_active)
VALUES (
  'Bienvenido a MYSAir',
  'Descubre nuestras soluciones innovadoras de ventilación. Haz clic en Aceptar para continuar.',
  '/images/popup-welcome.jpg',
  true
)
ON CONFLICT DO NOTHING;
