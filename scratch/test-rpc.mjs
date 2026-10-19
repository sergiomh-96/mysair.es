import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://awaqzjughhndfpxjiaff.supabase.co"
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXF6anVnaGhuZGZweGppYWZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ4OTI1MSwiZXhwIjoyMDczMDY1MjUxfQ.3U1iQeWqPLt8frR-u3Uy962Z4zyE78aciKSFueRF2Sw"

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function testRpc() {
  const { data, error } = await supabase.rpc("exec_sql", { sql: "SELECT 1" })
  console.log("exec_sql:", { data, error })
}

testRpc()
