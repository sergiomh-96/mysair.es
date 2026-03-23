-- Create admin user safely using a DO block to avoid conflicts
DO $$
DECLARE
  existing_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE email = 'sergio@mysair.es';

  IF existing_user_id IS NULL THEN
    -- Insert new user
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      role,
      aud,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'sergio@mysair.es',
      crypt('Yc#3Du$G9pZ9', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"is_admin": true}'::jsonb,
      false,
      'authenticated',
      'authenticated',
      '',
      '',
      '',
      ''
    );
  ELSE
    -- Update existing user password and metadata
    UPDATE auth.users
    SET
      encrypted_password = crypt('Yc#3Du$G9pZ9', gen_salt('bf')),
      raw_user_meta_data = '{"is_admin": true}'::jsonb,
      email_confirmed_at = now()
    WHERE id = existing_user_id;
  END IF;
END $$;

-- Add SEO fields to blog_posts table
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS meta_title character varying,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS og_title character varying,
  ADD COLUMN IF NOT EXISTS og_description text,
  ADD COLUMN IF NOT EXISTS og_image text,
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS reading_time integer,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
