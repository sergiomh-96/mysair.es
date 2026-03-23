import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Wind, Settings, Fan } from "lucide-react"
import Link from "next/link"

export function ProductsPreview() {
  const productCategories = [
    {
      title: "Difusión de Aire",
      description: "Rejillas, compuertas y difusores de alta calidad para distribución óptima del aire.",
      icon: Wind,
      image: "/difusion.jpg",
      products: ["Rejillas lineales", "Difusores circulares", "Compuertas reguladoras"],
      href: "/productos?categoria=air_diffusion",
    },
    {
      title: "Sistemas de Zonas",
      description: "Soluciones inteligentes de zonificación y control automático de clima.",
      icon: Settings,
      image: "/sistema-zonas2.png",
      products: ["Zonificación inteligente", "Termostatos digitales", "Control remoto"],
      href: "/productos?categoria=smart_systems",
    },
    {
      title: "VMC",
      description: "Sistemas de Ventilación Mecánica Controlada para renovación de aire eficiente.",
      icon: Fan,
      image: "/VMC_ppal5.png",
      products: ["Recuperadores de calor", "Sistemas residenciales", "Unidades de filtración"],
      href: "/productos?categoria=vmc",
    },
  ]

  return (
    <section className="bg-gray-50 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl mb-4 text-slate-800 font-medium">
            Los sistemas de zonificación permiten controlar la temperatura de cada estancia de forma independiente,
            logrando un confort total y un importante ahorro de energía
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">Descubre nuestros productos -&gt;</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {productCategories.map((category, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                </div>

                <p className="text-gray-600 mb-4 text-pretty">{category.description}</p>

                <ul className="space-y-2 mb-6">
                  {category.products.map((product, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                      {product}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href={category.href}>
                    Ver Productos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/productos">
              Ver Todos los Productos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
