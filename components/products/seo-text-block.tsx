import { Card, CardContent } from "@/components/ui/card"

interface SeoTextBlockProps {
  categoria?: string
}

export function SeoTextBlock({ categoria }: SeoTextBlockProps) {
  if (!categoria) return null

  let text = ""

  if (categoria === "air_diffusion") {
    text =
      "En MYSAir somos especialistas en el diseño y fabricación de soluciones de difusión. En nuestro catálogo técnico encontrarás todos los tipos de rejillas para aire acondicionado que tu proyecto necesita, desde rejillas de retorno de aire acondicionado hasta rejillas de ventilación de aluminio de alta durabilidad. Para proyectos residenciales o de oficinas, contamos con modelos específicos de rejillas aire acondicionado regulables y la clásica rejilla ventilación baño antirretorno, garantizando siempre el caudal exacto y la máxima integración estética."
  } else if (categoria === "smart_systems") {
    text =
      "El control preciso es la clave de la eficiencia. Nuestros sistemas de zonificación de aire acondicionado están diseñados para el instalador profesional. Combinando nuestras avanzadas compuertas de regulación de caudal con un cerebro central como el módulo de control de 7 zonas, puedes garantizar el confort independiente en cada estancia. Todo el sistema se gestiona fácilmente desde nuestro termostato digital táctil, asegurando una comunicación impecable y reduciendo los tiempos de instalación en obra."
  } else {
    return null
  }

  return (
    <div className="mt-12">
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <p className="text-gray-600 text-sm md:text-base leading-relaxed text-pretty">
            {text}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
