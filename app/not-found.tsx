import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { NotFoundContent } from "@/components/not-found-content"

export const metadata: Metadata = {
  title: "404 - Página no encontrada | MYSAir",
  description: "La página solicitada no existe o ha sido movida. Redirigiendo a la página principal.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-slate-900/20">
      <Navigation />
      <NotFoundContent />
      <Footer />
    </main>
  )
}
