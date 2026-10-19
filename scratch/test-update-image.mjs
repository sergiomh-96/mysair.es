import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://awaqzjughhndfpxjiaff.supabase.co"
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXF6anVnaGhuZGZweGppYWZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ4OTI1MSwiZXhwIjoyMDczMDY1MjUxfQ.3U1iQeWqPLt8frR-u3Uy962Z4zyE78aciKSFueRF2Sw"

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function test() {
  // Let's test with a test payload on product id 1 (just checking if it accepts text[] or jsonb)
  // We won't alter anything without reverting
  const { data: current } = await supabase.from("products").select("image_url").eq("id", 1).single()
  console.log("Current image_url type:", typeof current.image_url, Array.isArray(current.image_url))

  // Try saving JSON string inside text[]
  // In PostgreSQL TEXT[], each element is a string.
  // E.g. "https://domain.com/img.jpg#alt=Texto%20alternativo" or JSON-encoded object as string:
  // '{"url":"https://...","alt":"..."}' is a VALID string in a TEXT[] column!
}

test()
