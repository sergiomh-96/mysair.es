import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://awaqzjughhndfpxjiaff.supabase.co"
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXF6anVnaGhuZGZweGppYWZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ4OTI1MSwiZXhwIjoyMDczMDY1MjUxfQ.3U1iQeWqPLt8frR-u3Uy962Z4zyE78aciKSFueRF2Sw"

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function test() {
  const { data: p } = await supabase.from("products").select("id, image_url").limit(1).single()
  console.log("Product:", p)
  // Test updating with object in image_url
  const testVal = [JSON.stringify({ url: p.image_url[0], alt: "Test alt" })]
  console.log("Stringified testVal:", testVal)
  
  // Can text[] accept JSON string? Every JSON string is a string!
  // In PostgreSQL, TEXT[] can store ANY string, including JSON-stringified objects:
  // '{"url":"https://...","alt":"..."}'
  const { data, error } = await supabase.from("products").update({ image_url: testVal }).eq("id", p.id).select()
  console.log("Update result:", { data, error })

  // Revert back immediately
  if (!error) {
    await supabase.from("products").update({ image_url: p.image_url }).eq("id", p.id)
    console.log("Reverted successfully")
  }
}

test()
