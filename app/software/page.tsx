import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Pencil } from "lucide-react"
import { DiffuserSelector } from "@/components/diffuser-selector"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SoftwarePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
              Software de selección MYSAir
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Soluciones de software avanzadas para el control y gestión de sistemas de climatización
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <DiffuserSelector />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Dark overlay for text readability */}
          <div
            className="rounded-lg p-8 text-white flex flex-col items-center text-center relative overflow-hidden group"
            style={{
              backgroundImage: "url(/images/mys-solver-bg2.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "400px",
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
            <div className="relative z-10">
              
              <h2 className="text-3xl mb-2 font-black">MYS Solver 2.0</h2>
              <p className="text-xl mb-4 text-popover">Cálculo de instalaciones climáticas</p>
              <p className="max-w-xl mb-6 flex-grow text-card">
                Herramienta profesional para el dimensionamiento y cálculo de sistemas de climatización
              </p>
              <Link href="/software/mys-solver">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Acceder a MYS Solver 2.0
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="rounded-lg p-8 text-white flex flex-col items-center text-center relative overflow-hidden group"
            style={{
              backgroundImage: "url(/images/mys-draw-bg3.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "400px",
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
            <div className="relative z-10">
              
              <h2 className="text-3xl mb-2 font-black">MYS Draw 2.0</h2>
              <p className="text-xl mb-4 text-popover">Diseño de instalaciones climáticas por conductos</p>
              <p className="max-w-xl mb-6 flex-grow text-white">
                Software online profesional para el cálculo y diseño de instalaciones climáticas por conductos. Calcula
                difusión, potencia térmica necesaria, dimensionamiento de máquinas de aire y mucho más. Genera un
                informe completo en pdf de tu instalación.
              </p>
              <Link href="https://www.mysdraw.es/">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Acceder a MYS Draw 2.0
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardContent className="py-12 px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas ayuda con tu instalación?</h3>
            <p className="text-lg text-gray-600 mb-8">
              Si quieres que nuestros técnicos realicen el estudio de tu instalación ponte en contacto con nosotros
            </p>
            <Link href="/contacto">
              <Button size="lg" className="text-lg px-8">
                Contactar con nosotros
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
