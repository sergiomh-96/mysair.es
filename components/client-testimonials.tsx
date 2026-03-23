import { Star, Quote } from "lucide-react"

export function ClientTestimonials() {
  const testimonials = [
    {
      name: "Carlos Martínez",
      company: "Residencial Norte",
      text: "MYSAIR transformó completamente nuestro sistema de climatización. La eficiencia energética mejoró un 40%",
      rating: 5,
    },
    {
      name: "Ana García",
      company: "Oficinas Central Plaza",
      text: "El sistema de zonas que instalaron es increíble. Controlamos toda la climatización desde una app y hemos reducido significativamente los costos operativos.",
      rating: 5,
    },
    {
      name: "Miguel Rodríguez",
      company: "Residencial Las Flores",
      text: "Profesionales excepcionales. Desde el primer contacto hasta la instalación final, todo fue perfecto. Recomiendo MYSAIR sin dudarlo.",
      rating: 5,
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mejor carta de presentación. Descubre por qué confían en
            nosotros para sus proyectos más importantes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg relative">
              <Quote className="w-8 h-8 text-blue-600 mb-4" />

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-lg font-semibold">4.9/5</span>
            <span>basado en más de 200 reseñas</span>
          </div>
        </div>
      </div>
    </section>
  )
}
