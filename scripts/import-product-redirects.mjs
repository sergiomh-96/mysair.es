import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://awaqzjughhndfpxjiaff.supabase.co"
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXF6anVnaGhuZGZweGppYWZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ4OTI1MSwiZXhwIjoyMDczMDY1MjUxfQ.3U1iQeWqPLt8frR-u3Uy962Z4zyE78aciKSFueRF2Sw"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const RAW_REDIRECTS_DATA = `
https://mysair.es/producto/ma31-difusor-radial-para-techo-modular-2/;https://mysair.es/productos/ma31;
https://mysair.es/producto/ma09-rejilla-fija-45o-horizontal-lama-plana-ancha/;https://mysair.es/productos/ma09;
https://mysair.es/producto/ma16eq-ma16ex-rejilla-lineal-con-marco-slim-a-0o-con-regulacion-montada/;https://mysair.es/productos/ma16;
https://mysair.es/producto/mr10-by-pass-rectangular-contrapesa/;https://mysair.es/productos/mr10;
https://mysair.es/producto/ma24c-cuello-para-difusor-circular/;;pendiente de crear
https://mysair.es/producto/modulo-wifi/;https://mysair.es/productos/modulo_comunicacion;
https://mysair.es/producto/modulo-control-total-fancoils-por-reles/;https://mysair.es/productos/ctotal_fancoil;
https://mysair.es/producto/ma46-compuerta-rectangular-para-regulacion-caudal-2/;;pendiente de crear
https://mysair.es/producto/recuperador-calor-doble-flujo/;https://mysair.es/productos/recuperador-calor;
https://mysair.es/producto/ma27-difusor-circular-para-techo-modular/;https://mysair.es/productos/ma27;
https://mysair.es/producto/mr02-rejilla-impulsion-lama-curva-motorizada-motorizada/;https://mysair.es/productos/mr02;
https://mysair.es/producto/ma05q-ma05x-rejilla-lama-curva-horizontal-con-regulacion-montada/;https://mysair.es/productos/ma05;
https://mysair.es/producto/ma59-rejilla-estampada-para-exterior-con-malla/;https://mysair.es/productos/ma59;
https://mysair.es/producto/ma56-rejilla-reticula-90o-para-techo-modular/;https://mysair.es/productos/ma56;
https://mysair.es/producto/roma-termostato-tactil-monocromo-retroiluminado/;https://mysair.es/productos/termostato_roma;
https://mysair.es/producto/ma04-rejilla-simple-deflexion-vertical-lama-fija-45o/;https://mysair.es/productos/ma04;
https://mysair.es/producto/ma43-fijaciones/;;pendiente de crear
https://mysair.es/producto/ms104z-modulo-expansion-7-zonas/;https://mysair.es/productos/ms104z;
https://mysair.es/producto/ma16e-rejilla-lineal-con-marco-slim-0o/;https://mysair.es/productos/ma16;
https://mysair.es/producto/ma26-difusor-circular-alta-induccion/;https://mysair.es/productos/ma26;
https://mysair.es/producto/mr03-compuerta-mitad-conducto-c-regulacion-motorizada/;https://mysair.es/productos/mr03;
https://mysair.es/producto/ma11e-rejilla-doble-deflexion-horizontal-con-marco-slim/;https://mysair.es/productos/ma11;
https://mysair.es/producto/ms110w-modulo-wifi-y-radio/;https://mysair.es/productos/modulo_comunicacion;pendiente de crear - obsoletos
https://mysair.es/producto/ma11-rejilla-doble-deflexion-horizontal/;https://mysair.es/productos/ma11;
https://mysair.es/producto/harmony-termostato-tactil/;;pendiente de crear - obsoletos
https://mysair.es/producto/ms22-termostato-empotrable/;https://mysair.es/productos/termostato_ms22;pendiente de crear - obsoletos
https://mysair.es/producto/ma12q-ma12x-rejilla-doble-deflexion-vertical-con-regulacion-montada/;https://mysair.es/productos/ma12;
https://mysair.es/producto/ma62-difusor-rotacional-estampado-de-aletas-fijas-para-techo-modular/;https://mysair.es/productos/ma62;
https://mysair.es/producto/ma51-plenum-para-difusores-radiales-y-rotacionales/;https://mysair.es/productos/ma51;
https://mysair.es/producto/easylink/;https://mysair.es/productos/easylink;
https://mysair.es/producto/ma13-rejilla-lama-fija-45o-para-exterior/;https://mysair.es/productos/ma13;
https://mysair.es/producto/ma03-rejilla-simple-deflexion-horizontal-lama-fija-45o/;https://mysair.es/productos/ma03;
https://mysair.es/producto/ma02-rejilla-simple-deflexion-vertical/;https://mysair.es/productos/ma02;
https://mysair.es/producto/ma42-multi-tobera-largo-alcance-con-marco/;https://mysair.es/productos/ma42;
https://mysair.es/producto/ma35-difusor-lineal/;https://mysair.es/productos/ma35;
https://mysair.es/producto/ma33-difusor-rotacional-para-techo-continuo/;https://mysair.es/productos/ma33;
https://mysair.es/producto/arte-vesta-termostato-digital-4-a-color/;https://mysair.es/productos/termostato_vesta;
https://mysair.es/producto/ma06-rejilla-lama-curva-horizontal-doble-direccion/;https://mysair.es/productos/ma06;
https://mysair.es/producto/ma01e-rejilla-simple-deflexion-horizontal-con-marco-slim/;https://mysair.es/productos/ma01;
https://mysair.es/producto/ma18-rejilla-lama-ancha-para-techo-modular/;https://mysair.es/productos/ma18;
https://mysair.es/producto/ma54-rejilla-paso-de-aire-para-puertas/;https://mysair.es/productos/ma54;
https://mysair.es/producto/ma16q-ma16x-rejilla-lineal-con-marco-a-0o-con-regulacion-montada/;https://mysair.es/productos/ma16;
https://mysair.es/producto/ma12-rejilla-doble-deflexion-vertical/;https://mysair.es/productos/ma12;
https://mysair.es/producto/ma41-multi-tobera-esferica-con-marco/;https://mysair.es/productos/ma41;
https://mysair.es/producto/ma16-rejilla-lineal-con-marco-0o/;https://mysair.es/productos/ma16;
https://mysair.es/producto/ma01-rejilla-simple-deflexion-horizontal/;https://mysair.es/productos/ma01;
https://mysair.es/producto/ms109w-2-modulo-wifi/;https://mysair.es/productos/modulo_comunicacion;
https://mysair.es/producto/ma17q-ma17x-rejilla-lineal-con-marco-slim-a-20o-y-regulacion-montada/;https://mysair.es/productos/ma17;
https://mysair.es/producto/ma22-rejilla-para-techo-modular/;https://mysair.es/productos/ma22;
https://mysair.es/producto/ma01eq-ma01ex-rejilla-simple-deflexion-horizontal-con-marco-slim-y-regulacion-montada/;https://mysair.es/productos/ma01;
https://mysair.es/producto/ma35o-difusor-lineal-oculto/;https://mysair.es/productos/ma35o;
https://mysair.es/producto/neo-termostato-digital-tactil/;https://mysair.es/productos/termostato_neo;
https://mysair.es/producto/ma17q-ma17x-rejilla-lineal-con-marco-a-20o-y-regulacion-montada/;https://mysair.es/productos/ma17;
https://mysair.es/producto/ma11q-ma11x-rejilla-doble-deflexion-horizontal-con-regulacion-montada/;https://mysair.es/productos/ma11;
https://mysair.es/producto/mr08-difusor-cuadrado-motorizado/;https://mysair.es/productos/mr08;
https://mysair.es/producto/ma47-compuerta-circular-para-regulacion-caudal/;;pendiente de crear
https://mysair.es/producto/mr05-compuerta-circular-c-regulacion-motorizada/;https://mysair.es/productos/mr05;
https://mysair.es/producto/ms20-termostato-tactil/;https://mysair.es/productos/termostato_ms20;pendiente de crear - obsoletos
https://mysair.es/producto/chr-modulo-de-control-7-zonas-techos-radiantes/;https://mysair.es/productos/chr;pendiente de crear
https://mysair.es/producto/ma12e-rejilla-doble-deflexion-vertical-con-marco-slim/;https://mysair.es/productos/ma12;
https://mysair.es/producto/ma01q-ma01x-rejilla-simple-deflexion-horizontal-con-regulacion-montada/;https://mysair.es/productos/ma01;
https://mysair.es/producto/arte-termostato-color/;https://mysair.es/productos/termostato_arte;
https://mysair.es/producto/ma20-rejilla-lama-curva-para-techo-modular/;https://mysair.es/productos/ma20;
https://mysair.es/producto/ma28-difusor-cuadrado-para-techo-modular/;https://mysair.es/productos/ma28;
https://mysair.es/producto/ma34-difusor-radial-para-techo-continuo/;https://mysair.es/productos/ma34;
https://mysair.es/producto/chr-modulo-control-elementos-radiantes/;https://mysair.es/productos/chr;
https://mysair.es/producto/ma15-rejilla-lineal-sin-marco-20o/;https://mysair.es/productos/ma15;
https://mysair.es/producto/ma48-plenum-para-difusor-lineal/;https://mysair.es/productos/ma48;
https://mysair.es/producto/ma17-rejilla-lineal-con-marco-20o/;https://mysair.es/productos/ma17;
https://mysair.es/producto/centralita-ms103m/;https://mysair.es/productos/ms103v;pendiente de crear - obsoletos
https://mysair.es/producto/mr06-difusor-circular-motorizado/;https://mysair.es/productos/mr06;
https://mysair.es/producto/ma56-rejilla-reticula-90o-techo-modular/;https://mysair.es/productos/ma56;
https://mysair.es/producto/ma19-rejilla-lama-ancha-para-techo-modular-de-dos-direcciones/;https://mysair.es/productos/ma19;
https://mysair.es/producto/ma44-plenum-para-rejillas/;https://mysair.es/productos/ma44;
https://mysair.es/producto/ma55-rejilla-para-conducto-circular-horizontal/;https://mysair.es/productos/ma55;
https://mysair.es/producto/mr11-by-pass-rectangular-conducido-contrapesa/;https://mysair.es/productos/mr11;
https://mysair.es/producto/ms108rf-modulo-radiofrecuencia/;https://mysair.es/productos/modulo_comunicacion;pendiente de crear - obsoletos
https://mysair.es/producto/ma22e-rejilla-para-techo-modular-con-marco-slim/;https://mysair.es/productos/ma22;"pendiente de crear - no esta creada la variante ""E"""
https://mysair.es/producto/ma16qd-ma16xd-rejilla-2x1-lineal-con-marco-a-0o-con-regulacion-montada-copia/;https://mysair.es/productos/ma16;
https://mysair.es/producto/ma11eq-ma11ex-rejilla-doble-deflexion-horizontal-con-marco-slim-y-regulacion-montada/;https://mysair.es/productos/ma11;
https://mysair.es/producto/ma03q-ma03x-rejilla-simple-horizontal-fija-a-45o-con-regulacion-montada/;https://mysair.es/productos/ma03;
https://mysair.es/producto/ma24p-plenum-difusor-circular/;https://mysair.es/productos/ma24p;
https://mysair.es/producto/ms210wr-modulo-wifi-y-radio-2-0/;https://mysair.es/productos/modulo_comunicacion;
https://mysair.es/producto/ma02-rejilla-simple-deflexion-vertical-con-marco-slim/;https://mysair.es/productos/ma02;
https://mysair.es/producto/ms23-termostato-tactil-a-color-copia/;https://mysair.es/productos/termostato_ms23;pendiente de crear - obsoletos
https://mysair.es/producto/ma37-tobera-impulsion-largo-alcance/;https://mysair.es/productos/ma37;
https://mysair.es/producto/ma08-rejilla-lama-curva-vertical-doble-direccion/;https://mysair.es/productos/ma08;
https://mysair.es/producto/ma45-marco-de-montaje/;;pendiente de crear 
https://mysair.es/producto/mr16-rejilla-lineal-con-marco-0o-c-regulacion-motorizada/;https://mysair.es/productos/mr16;
https://mysair.es/producto/sistema-de-1-zona-autonoma/;https://mysair.es/productos;pendiente de crear 
https://mysair.es/producto/ma23-rejilla-lama-fija-45o-para-techo-modular/;https://mysair.es/productos/ma23;
https://mysair.es/producto/ma61-rejilla-perforada-retorno-para-techo-modular/;https://mysair.es/productos/ma61;
https://mysair.es/producto/mr15-compuerta-c-regulacion-motorizada/;https://mysair.es/productos/mr15;
https://mysair.es/producto/ms201v-modulo-de-control-de-7-zonas-cable/;https://mysair.es/productos/ms201v;
https://mysair.es/producto/ma36-boca-de-extraccion/;https://mysair.es/productos/ma36;
https://mysair.es/producto/ma17-rejilla-lineal-con-marco-slim-20o/;https://mysair.es/productos/ma17;
https://mysair.es/producto/ms208rf-modulo-radiofrecuencia-2-0/;https://mysair.es/productos/modulo_comunicacion;
https://mysair.es/producto/alfa-termostato-tactil-monocromo/;https://mysair.es/productos/termostato_alfa;pendiente de crear - obsoletos
https://mysair.es/producto/ma11qd-ma11xd-rejilla-2x1-doble-deflexion-horizontal-con-regulacion-montada-copia/;https://mysair.es/productos/ma11;
https://mysair.es/producto/ma30-difusor-rotacional-para-techo-modular/;https://mysair.es/productos/ma30;
https://mysair.es/producto/ma25p-plenum-para-difusor-cuadrado/;https://mysair.es/productos/ma25p;
https://mysair.es/producto/ma35e-difusor-lineal-con-marco-slim/;https://mysair.es/productos/ma35;
https://mysair.es/producto/ma24-difusor-circular/;https://mysair.es/productos/ma24;
https://mysair.es/producto/ma38-tobera-rectangular/;https://mysair.es/productos/ma38;
https://mysair.es/producto/ma01qd-ma01xd-rejilla-2x1-simple-deflexion-horizontal-con-regulacion-montada/;https://mysair.es/productos/ma01;
https://mysair.es/producto/ma40-multi-tobera-esferica/;https://mysair.es/productos/ma40;
https://mysair.es/producto/modulo-control-total/;https://mysair.es/productos/ctotal_dx;
https://mysair.es/producto/ma14-rejilla-lineal-sin-marco-0o/;https://mysair.es/productos/ma14;
https://mysair.es/producto/ma32-difusor-radial-cuadrado-para-techo-modular/;https://mysair.es/productos/ma32;
https://mysair.es/producto/neo-termostato-tactil-monocromo-con-humedad-y-pantalla-retroiluminada/;https://mysair.es/productos/termostato_neo;
https://mysair.es/producto/ms117a/;https://mysair.es/productos/chr;
https://mysair.es/producto/mr01-rejilla-impulsion-motorizada/;https://mysair.es/productos/mr01;
https://mysair.es/producto/ma39-multi-tobera-rectangular-con-marco/;https://mysair.es/productos/ma39;
https://mysair.es/producto/ma29-difusor-radial-para-techo-modular/;https://mysair.es/productos/ma29;
https://mysair.es/producto/ma12q-ma12x-rejilla-doble-deflexion-vertical-con-marco-slim-y-regulacion-montada/;https://mysair.es/productos/ma12;
https://mysair.es/producto/vexus/;;pendiente de crear
https://mysair.es/producto/ma25-difusor-cuadrado/;https://mysair.es/productos/ma25;
https://mysair.es/producto/ma58-rejilla-circular-para-exterior-con-malla/;https://mysair.es/productos/ma58;
https://mysair.es/producto/modulo-control-total-fancoil-1-10v-triac/;https://mysair.es/productos/ctotal_fancoil;pendiente de crear
https://mysair.es/producto/ma10-rejilla-fija-45o-vertical-lama-plana-ancha/;https://mysair.es/productos/ma10;
https://mysair.es/producto/ma21-rejilla-lama-curva-para-techo-modular-doble-direccion/;https://mysair.es/productos/ma21;
https://mysair.es/producto/ms-knxcom-modulo-knx/;https://mysair.es/productos/modulo_knx;
https://mysair.es/producto/plenum-motorizado-compuertas-circulares/;https://mysair.es/productos/airkit;
https://mysair.es/producto/mr04-rejilla-doble-reflexion-c-regulacion-motorizada/;https://mysair.es/productos/mr04;
https://mysair.es/producto/mr14-by-pass-circular-motorizado/;https://mysair.es/productos/mr12;pendiente de crear
https://mysair.es/producto/ma60c-multi-tobera-impulsion-largo-alcance-para-tubo-circular/;https://mysair.es/productos/ma60c;
https://mysair.es/producto/termostato-digital/;;producto descatalogado - para dar de baja
https://mysair.es/producto/mr12-by-pass-circular-contrapesa/;https://mysair.es/productos/mr12;
https://mysair.es/producto/ma60-multi-tobera-impulsion-largo-alcance/;https://mysair.es/productos/ma60;
https://mysair.es/producto/ma05-rejilla-lama-curva-horizontal/;https://mysair.es/productos/ma05;
;https://mysair.es/productos/ms_kit;nuevo producto
`

function extractPath(urlStr) {
  if (!urlStr) return ""
  try {
    const u = new URL(urlStr)
    return u.pathname
  } catch {
    return urlStr.startsWith("/") ? urlStr : "/" + urlStr
  }
}

function parseRedirects() {
  const lines = RAW_REDIRECTS_DATA.trim().split("\n")
  const records = []
  const seen = new Set()

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("URL Antigua")) continue

    const parts = trimmed.split(";").map((p) => p.trim().replace(/^"|"$/g, ""))
    const rawSource = parts[0] || ""
    const rawDest = parts[1] || ""
    const note = parts[2] || ""

    if (!rawSource) continue

    const sourcePath = extractPath(rawSource)
    if (!sourcePath || sourcePath === "/" || seen.has(sourcePath)) continue
    seen.add(sourcePath)

    // Si no tiene destino o está pendiente, redirige al catálogo general temporalmente para no dar 404
    let destinationUrl = rawDest
    let description = note || null
    if (!destinationUrl) {
      destinationUrl = "https://mysair.es/productos"
      description = note ? `${note} (Provisional a catálogo)` : "Provisional a catálogo"
    }

    records.push({
      source_path: sourcePath,
      destination_url: destinationUrl,
      redirect_type: 301,
      description: description,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
  }

  return records
}

async function run() {
  console.log("Iniciando importación de redirecciones a Supabase...")
  const records = parseRedirects()
  console.log(`Se procesaron ${records.length} redirecciones válidas.`)

  // Inserción en bloques de 50 para evitar sobrecarga
  const CHUNK_SIZE = 50
  let insertedCount = 0

  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE)
    const { data, error } = await supabase
      .from("url_redirects")
      .upsert(chunk, { onConflict: "source_path" })
      .select("id")

    if (error) {
      console.error(`Error insertando bloque ${i / CHUNK_SIZE + 1}:`, error)
      process.exit(1)
    }

    insertedCount += chunk.length
    console.log(`Progreso: ${insertedCount} / ${records.length} insertadas...`)
  }

  console.log("✅ ¡Importación completada con éxito!")
}

run()
