import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Activity, Cpu, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function RegulationControlSection() {
  const solutions = [
    {
      id: "ms201v",
      title: "Cumplimiento de la zonificación segun RITE 178/2021",
      description:
        "El RITE 2021 actualiza las reglas para la zonificación térmica en edificios, exigiendo que las instalaciones se diseñen por zonas térmicas claramente definidas. Esto permite regular con precisión calefacción, refrigeración y ventilación en función de las necesidades reales de cada espacio, optimizando la eficiencia energética y el confort interior.",
      icon: Cpu,
      features: [
        "Control zonificado por estancia",
        "Control de aire y suelo radiante",
        "Programación horaria por estancia",
      ],
      color: "text-blue-600",
      bg: "bg-blue-50",
      image: "/vivienda-zonif3.png",
      link: "https://drive.google.com/open?id=1DJAZUA6nJIobNIC6Koj5ra9LHay7uI-v&usp=drive_fs",
    },
    {
      id: "chr",
      title: "Comunicación e integración con equipos a/c y fancoils",
      description:
        "Gestión unificada de equipos de expansión directa y fancoils de las principales marcas del mercado. Control total de la unidad interior desde el sistema MYSAir, garantizando un control central unificado.",
      icon: Cpu,
      features: [
        "Compatibilidad con principales marcas",
        "Comunicación por cable o IR",
        "Gestión de modos de trabajo y temperatura",
      ],
      color: "text-orange-600",
      bg: "bg-orange-50",
      image: "/gateway1.jpg",
    },
    {
      id: "ctotal",
      title: "Integraciones domóticas",
      description:
        "Soluciones para la integración con sistemas de automatización y domotica mediante protocolos MODBUS, KNX o API. Controla tu instalación desde cualquier lugar mediante nuestra APP MYSAir",
      icon: Share2,
      features: ["Modbus RTU, WiFi, 868MHz, API", "KNX, LOXONE, FIBARO ", "HomeAssistant, AlfredSmart"],
      color: "text-purple-600",
      bg: "bg-purple-50",
      image: "/integraciones3.png",
    },
  ]

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Soluciones de Regulación y Control MYSAir
          </h2>
          <p className="text-lg text-gray-600">
            Tecnología avanzada para la gestión inteligente de la climatización. Descubre nuestros sistemas diseñados
            para maximizar la eficiencia y el confort.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {solutions.map((solution) => (
            <Card
              key={solution.id}
              className="group hover:shadow-xl transition-all duration-300 border-none shadow-md overflow-hidden flex flex-col"
            >
              <div className={`h-2 w-full ${solution.bg.replace("bg-", "bg-opacity-100 bg-")}`} />
              {/* Added image to the card */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={solution.image || "/placeholder.svg"}
                  alt={solution.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">{solution.title}</CardTitle>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{solution.subtitle}</p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-gray-600 mb-6 line-clamp-3">{solution.description}</p>

                <ul className="space-y-2 mb-6 flex-grow">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <Activity className={`h-4 w-4 mr-2 ${solution.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {solution.link ? (
                  <Link href={solution.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-between group-hover:text-blue-600 hover:bg-blue-50 mt-auto"
                    >
                      Ver documento justificativo RITE
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-between group-hover:text-blue-600 hover:bg-blue-50 mt-auto"
                  >
                    Más información
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
