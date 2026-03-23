import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AboutHero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">
              Expertos en soluciones de regulación y control del clima        
            </h1>
            <p className="text-xl text-gray-600 mb-8 text-pretty">
              En MYSAir somos especialistas en soluciones de climatización inteligente. Con más de 25 años de experiencia, combinamos tecnología avanzada con un servicio personalizado para crear ambientes perfectos en hogares y oficinas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/contacto">Conoce Nuestros Servicios</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/productos">Ver Productos</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden">
              <img src="/EMPRESA.jpg" alt="Oficinas MYSAir" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
