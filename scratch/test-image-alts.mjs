import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://awaqzjughhndfpxjiaff.supabase.co"
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXF6anVnaGhuZGZweGppYWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODkyNTEsImV4cCI6MjA3MzA2NTI1MX0.Y7O1P320s6kz7Nxs1zwUJIWiocMHD52dv3lo7Oam7Uo"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  const { data, error } = await supabase.from("products").select("image_alts").limit(1)
  console.log("image_alts query result:", { data, error })
}

main()
