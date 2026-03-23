-- Add example data for product MA01 with all new fields
-- This includes variants, dimensions, colors, fixation types, insulation, lines/vias, communication, and documentation

-- First, insert or update the MA01 product
INSERT INTO products (
  code,
  name, 
  description, 
  category, 
  subcategory, 
  price, 
  image_url, 
  technical_specs,
  is_featured,
  variants,
  dimensions,
  colors,
  fixation_types,
  insulation_types,
  lines_vias,
  communication_types,
  ficha_tecnica_url,
  manual_usuario_url,
  manual_instalador_url,
  cad_url,
  bim_url
) VALUES (
  'MA01',
  'Módulo de Aire Inteligente MA01',
  'Módulo de control de aire con múltiples opciones de configuración y conectividad avanzada',
  'smart_systems',
  'controls',
  299.99,
  '/smart-module-ma01.jpg',
  '{"power": "24V AC/DC", "consumption": "5W", "operating_temp": "-10°C a 50°C", "protection": "IP54"}',
  true,
  -- Variants (name, code, description)
  '[
    {"name": "Standard", "code": "STD", "description": "Versión estándar con funciones básicas"},
    {"name": "Pro", "code": "PRO", "description": "Versión profesional con funciones avanzadas"},
    {"name": "Premium", "code": "PRM", "description": "Versión premium con todas las funciones"}
  ]'::jsonb,
  -- Dimensions (name, code, width, height, depth, unit)
  '[
    {"name": "Compacto", "code": "CPT", "width": 100, "height": 100, "depth": 50, "unit": "mm"},
    {"name": "Estándar", "code": "STD", "width": 150, "height": 150, "depth": 75, "unit": "mm"},
    {"name": "Grande", "code": "GRD", "width": 200, "height": 200, "depth": 100, "unit": "mm"}
  ]'::jsonb,
  -- Colors (name, code, hex_color)
  '[
    {"name": "Blanco", "code": "BL", "hex_color": "#FFFFFF"},
    {"name": "Negro", "code": "NG", "hex_color": "#000000"},
    {"name": "Gris", "code": "GR", "hex_color": "#808080"},
    {"name": "Plata", "code": "PL", "hex_color": "#C0C0C0"}
  ]'::jsonb,
  -- Fixation Types (name, code, description)
  '[
    {"name": "Empotrado", "code": "EMP", "description": "Instalación empotrada en pared"},
    {"name": "Superficie", "code": "SUP", "description": "Instalación en superficie"},
    {"name": "Carril DIN", "code": "DIN", "description": "Montaje en carril DIN"}
  ]'::jsonb,
  -- Insulation Types (name, code, description)
  '[
    {"name": "Sin Aislamiento", "code": "SA", "description": "Sin aislamiento térmico"},
    {"name": "Aislamiento Básico", "code": "AB", "description": "Aislamiento térmico básico"},
    {"name": "Aislamiento Reforzado", "code": "AR", "description": "Aislamiento térmico reforzado"}
  ]'::jsonb,
  -- Lines/Vias (name, code, description)
  '[
    {"name": "2 Vías", "code": "2V", "description": "Sistema de 2 vías"},
    {"name": "4 Vías", "code": "4V", "description": "Sistema de 4 vías"},
    {"name": "6 Vías", "code": "6V", "description": "Sistema de 6 vías"},
    {"name": "8 Vías", "code": "8V", "description": "Sistema de 8 vías"}
  ]'::jsonb,
  -- Communication Types (name, code, description)
  '[
    {"name": "WiFi", "code": "WF", "description": "Conectividad WiFi 2.4GHz"},
    {"name": "Zigbee", "code": "ZB", "description": "Protocolo Zigbee 3.0"},
    {"name": "Modbus", "code": "MB", "description": "Protocolo Modbus RTU/TCP"},
    {"name": "KNX", "code": "KX", "description": "Protocolo KNX estándar"}
  ]'::jsonb,
  -- Ficha Técnica (array of documents)
  '[
    {"name": "Ficha Técnica General MA01", "url": "https://example.com/docs/ma01-ficha-general.pdf"},
    {"name": "Especificaciones Eléctricas", "url": "https://example.com/docs/ma01-especificaciones-electricas.pdf"},
    {"name": "Certificaciones y Normativas", "url": "https://example.com/docs/ma01-certificaciones.pdf"}
  ]'::jsonb,
  -- Manual Usuario (array of documents)
  '[
    {"name": "Manual de Usuario MA01 v2.0", "url": "https://example.com/docs/ma01-manual-usuario-v2.pdf"},
    {"name": "Guía Rápida de Inicio", "url": "https://example.com/docs/ma01-guia-rapida.pdf"},
    {"name": "Preguntas Frecuentes", "url": "https://example.com/docs/ma01-faq.pdf"}
  ]'::jsonb,
  -- Manual Instalador (array of documents)
  '[
    {"name": "Manual de Instalación MA01", "url": "https://example.com/docs/ma01-manual-instalacion.pdf"},
    {"name": "Guía de Conexionado", "url": "https://example.com/docs/ma01-conexionado.pdf"},
    {"name": "Configuración Avanzada", "url": "https://example.com/docs/ma01-config-avanzada.pdf"}
  ]'::jsonb,
  -- CAD Files (array of documents)
  '[
    {"name": "MA01 - Plano 2D DWG", "url": "https://example.com/cad/ma01-2d.dwg"},
    {"name": "MA01 - Plano 2D DXF", "url": "https://example.com/cad/ma01-2d.dxf"},
    {"name": "MA01 - Modelo 3D STEP", "url": "https://example.com/cad/ma01-3d.step"}
  ]'::jsonb,
  -- BIM Files (array of documents)
  '[
    {"name": "MA01 - Modelo Revit 2023", "url": "https://example.com/bim/ma01-revit-2023.rfa"},
    {"name": "MA01 - Modelo Revit 2024", "url": "https://example.com/bim/ma01-revit-2024.rfa"},
    {"name": "MA01 - Modelo IFC", "url": "https://example.com/bim/ma01.ifc"}
  ]'::jsonb
)
ON CONFLICT (code) 
DO UPDATE SET
  variants = EXCLUDED.variants,
  dimensions = EXCLUDED.dimensions,
  colors = EXCLUDED.colors,
  fixation_types = EXCLUDED.fixation_types,
  insulation_types = EXCLUDED.insulation_types,
  lines_vias = EXCLUDED.lines_vias,
  communication_types = EXCLUDED.communication_types,
  ficha_tecnica_url = EXCLUDED.ficha_tecnica_url,
  manual_usuario_url = EXCLUDED.manual_usuario_url,
  manual_instalador_url = EXCLUDED.manual_instalador_url,
  cad_url = EXCLUDED.cad_url,
  bim_url = EXCLUDED.bim_url;
