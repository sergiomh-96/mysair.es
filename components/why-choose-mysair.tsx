import { CheckCircle, Award, Users, Wrench } from "lucide-react"

export function WhyChooseMysair() {
  const reasons = [
    {
      icon: Award,
      title: "Más de 15 años de experiencia",
      description: "Líderes en el sector de climatización y domótica con un historial comprobado de excelencia.",
    },
    {
      icon: CheckCircle,
      title: "Calidad garantizada",
      description: "Productos certificados y servicios respaldados por las mejores marcas del mercado.",
    },
    {
      icon: Users,
      title: "Equipo especializado",
      description: "Técnicos altamente cualificados y en constante formación para ofrecer las mejores soluciones.",
    },
    {
      icon: Wrench,
      title: "Servicio integral",
      description: "Desde el diseño hasta la instalación y mantenimiento, cubrimos todas tus necesidades.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir MYSAIR?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Somos tu socio de confianza en climatización y domótica, ofreciendo soluciones innovadoras y un servicio
            excepcional que marca la diferencia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
