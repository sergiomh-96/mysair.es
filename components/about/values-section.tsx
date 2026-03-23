import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lightbulb, Heart, Leaf } from "lucide-react"

export function ValuesSection() {
  const values = [
    {
      icon: Shield,
      title: "Calidad y Confianza",
      description:
        "Garantizamos la máxima calidad en todos nuestros productos y servicios, construyendo relaciones duraderas basadas en la confianza.",
    },
    {
      icon: Lightbulb,
      title: "Innovación Constante",
      description:
        "Invertimos continuamente en I+D para ofrecer las soluciones más avanzadas y eficientes del mercado.",
    },
    {
      icon: Heart,
      title: "Compromiso con el Cliente",
      description:
        "Cada proyecto es único. Nos adaptamos a las necesidades específicas de cada cliente para superar sus expectativas.",
    },
    {
      icon: Leaf,
      title: "Sostenibilidad",
      description:
        "Promovemos soluciones eco-eficientes que reducen el impacto ambiental y optimizan el consumo energético.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Los principios que guían cada decisión y nos definen como empresa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
