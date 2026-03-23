import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, EuroIcon } from "lucide-react"

async function getExternalLinks(): Promise<any[]> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )

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

  const getIcon = (type: string) => {
    switch (type) {
      case "catalog":
        return <FileText className="h-8 w-8 text-primary" />
      case "tariff":
        return <EuroIcon className="h-8 w-8 text-primary" />
      default:
        return <FileText className="h-8 w-8 text-primary" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Catálogo y Documentación</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Accede a nuestros documentos técnicos y comerciales para obtener información detallada sobre nuestros
            productos y servicios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {links.map((link) => (
            <Card key={link.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">{getIcon(link.type)}</div>
                <CardTitle className="text-2xl font-bold text-card-foreground">{link.name}</CardTitle>
                <CardDescription className="text-muted-foreground text-base">{link.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Ver Documento
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {links.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay documentos disponibles en este momento.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
