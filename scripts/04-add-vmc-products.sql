-- Add VMC (Ventilación Mecánica Controlada) products to MYSAir catalog

INSERT INTO products (name, description, category, subcategory, price, image_url, technical_specs, is_featured) VALUES
('Recuperador de Calor REC-300', 'Recuperador de calor de flujos cruzados con intercambiador de alta eficiencia', 'vmc', 'heat_recovery', 1899.99, '/heat-recovery-unit.jpg', '{"efficiency": "92%", "airflow": "50-300 m³/h", "filters": "F7+G4", "noise": "< 35 dB(A)", "power": "45-180W"}', true),

('Sistema VMC Residencial VMC-150', 'Sistema de ventilación mecánica controlada para viviendas unifamiliares', 'vmc', 'residential', 1299.99, '/residential-vmc.jpg', '{"airflow": "150 m³/h", "rooms": "Hasta 4 habitaciones", "installation": "Conductos Ø125mm", "control": "Higrostato integrado", "consumption": "15-45W"}', true),

('Ventilador Centrífugo Industrial VCI-500', 'Ventilador centrífugo de alta presión para instalaciones comerciales', 'vmc', 'commercial', 2499.99, '/centrifugal-fan.jpg', '{"airflow": "500-2000 m³/h", "pressure": "800 Pa", "motor": "IE3 Premium", "material": "Acero galvanizado", "mounting": "Horizontal/Vertical"}', false),

('Unidad de Filtración UF-400', 'Unidad de filtración avanzada con filtros HEPA y carbón activo', 'vmc', 'filtration', 899.99, '/filtration-unit.jpg', '{"filters": ["G4", "F7", "HEPA H13", "Carbón activo"], "airflow": "400 m³/h", "efficiency": "99.97%", "maintenance": "Indicador LED"}', true),

('Recuperador Entálpico RE-250', 'Recuperador entálpico con intercambio de temperatura y humedad', 'vmc', 'heat_recovery', 2199.99, '/enthalpy-recovery.jpg', '{"efficiency_temp": "85%", "efficiency_humidity": "70%", "airflow": "250 m³/h", "bypass": "Automático verano", "defrost": "Sistema antihielo"}', false),

('VMC Descentralizada VMC-D80', 'Unidad de ventilación descentralizada con recuperación de calor', 'vmc', 'decentralized', 449.99, '/decentralized-vmc.jpg', '{"airflow": "80 m³/h", "efficiency": "88%", "installation": "Mural Ø160mm", "noise": "< 25 dB(A)", "control": "Remoto incluido"}', true),

('Sistema Híbrido VMC-H200', 'Sistema híbrido de ventilación natural y mecánica controlada', 'vmc', 'hybrid', 1699.99, '/hybrid-vmc.jpg', '{"modes": ["Natural", "Mecánico", "Mixto"], "airflow": "200 m³/h", "sensors": "Viento, temperatura, CO2", "automation": "Totalmente automático"}', false),

('Caja de Ventilación CV-300', 'Caja de ventilación silenciosa con motor EC de bajo consumo', 'vmc', 'commercial', 799.99, '/ventilation-box.jpg', '{"airflow": "300 m³/h", "motor": "EC brushless", "noise": "< 30 dB(A)", "mounting": "Techo/suelo", "control": "0-10V + Modbus"}', false);
