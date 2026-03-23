ALTER TABLE IF EXISTS url_redirects RENAME TO url_redirects_old_backup;

CREATE TABLE url_redirects (
  id          bigserial PRIMARY KEY,
  source_path text        NOT NULL UNIQUE,
  destination_url text    NOT NULL,
  redirect_type integer   NOT NULL DEFAULT 301,
  description text,
  is_active   boolean     NOT NULL DEFAULT true,
  hit_count   integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Seed with the first redirect the user requested
INSERT INTO url_redirects (source_path, destination_url, redirect_type, description, is_active)
VALUES (
  '/cloud/descargas_mysair/Catalogo/Tarifas/Tarifa_MYSAir.pdf',
  'https://drive.google.com/open?id=1PQn9--AIdggMvCfRjsEMwbJzYGA-rKrN&usp=drive_fs',
  302,
  'Tarifa MYSAir - redirige a Google Drive',
  true
);
