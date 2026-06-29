import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DocumentationContent } from "@/components/docs/documentation-content"

export const metadata: Metadata = {
  title: "Documentación Técnica y Catálogos | MYSAir",
  description:
    "Accede a toda la documentación técnica, manuales de instalación, catálogos y tarifas de los sistemas y productos MYSAir.",
}

async function getExternalLinks(): Promise<any[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("external_links")
    .select("*")
    .eq("is_active", true)
    .order("type", { ascending: true })

  if (error) {
    console.error("Error fetching external links:", error)
    return []
  }

  return data || []
}

export default async function CatalogoPage() {
  const links = await getExternalLinks()

  return <DocumentationContent links={links} />
}
