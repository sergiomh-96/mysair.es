import { Card, CardContent } from "@/components/ui/card"

export function CompanyHistory() {
  const milestones = [
    {
      year: "1995",
      title: "Fundación de MYSAir",
      description: "Iniciamos como una pequeña empresa familiar especializada en instalaciones de aire acondicionado.",
    },
    {
      year: "2005",
      title: "Expansión Nacional",
      description: "Ampliamos nuestros servicios a nivel nacional y comenzamos a trabajar con grandes corporaciones.",
    },
    {
      year: "2015",
      title: "Innovación Tecnológica",
      description: "Incorporamos sistemas de zonas y soluciones inteligentes de climatización.",
    },
    {
      year: "2020",
      title: "Sostenibilidad",
      description: "Lanzamos nuestra línea de productos eco-eficientes y sistemas de energía renovable.",
    },
    {
      year: "2024",
      title: "Liderazgo Digital",
      description: "Implementamos IA y IoT en nuestros sistemas para optimizar el rendimiento energético.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Historia</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un recorrido de innovación y crecimiento que nos ha convertido en líderes del sector
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className="flex-1">
                  <Card className={`max-w-md ${index % 2 === 0 ? "ml-auto mr-8" : "mr-auto ml-8"}`}>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline dot */}
                <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
