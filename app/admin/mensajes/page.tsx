import { createServerClient } from "@/lib/supabase/server"
import { AdminMessagesClient } from "@/components/admin/admin-messages-client"

export default async function AdminMensajesPage() {
  const supabase = await createServerClient()
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })

  return <AdminMessagesClient initialMessages={messages ?? []} />
}
