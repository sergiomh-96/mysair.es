import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Award, Wrench } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Building2,
      number: "500+",
      label: "Proyectos Completados",
      description: "Instalaciones exitosas en toda España",
    },
    {
      icon: Users,
      number: "25+",
      label: "Años de Experiencia",
      description: "Una larga trayectoria en el sector hvac nos avala",
    },
    {
      icon: Award,
      number: "98%",
      label: "Satisfacción del Cliente",
      description: "Calidad garantizada en cada proyecto",
    },
    {
      icon: Wrench,
      number: "5+",
      label: "Presentes en más de 5 paises",
      description: "Expansión internacional continua",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Números que Hablan por Nosotros</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestra trayectoria y compromiso se reflejan en cada proyecto que realizamos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
