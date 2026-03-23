import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TeamSection() {
  const team = [
    {
      name: "Carlos Martínez",
      role: "Director General",
      description: "Ingeniero Industrial con más de 20 años de experiencia en el sector de climatización.",
      image: "/professional-businessman-portrait.png",
    },
    {
      name: "Ana García",
      role: "Directora Técnica",
      description: "Especialista en sistemas de zonas y eficiencia energética. Lidera nuestro departamento de I+D.",
      image: "/professional-businesswoman-portrait.png",
    },
    {
      name: "Miguel Rodríguez",
      role: "Jefe de Instalaciones",
      description: "Técnico certificado con amplia experiencia en instalaciones comerciales e industriales.",
      image: "/professional-technician-portrait.png",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        

        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Quieres Formar Parte de Nuestro Equipo?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Estamos siempre buscando talento excepcional para unirse a nuestra misión de crear ambientes perfectos a
              través de la innovación tecnológica.
            </p>
            <Button asChild size="lg">
              <Link href="/contacto">Envía tu CV</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
