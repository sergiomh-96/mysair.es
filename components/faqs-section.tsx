"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "¿Qué es la zonificación en climatización?",
    answer:
      "La zonificación consiste en dividir una vivienda o negocio en diferentes áreas, controlando de forma independiente la temperatura y el caudal de aire mediante rejillas motorizadas y termostatos inteligentes.",
  },
  {
    question: "¿Qué ventajas tiene instalar rejillas de zonificación?",
    answer:
      "Permiten un confort personalizado, reducen el consumo energético, evitan climatizar zonas vacías y ayudan a ahorrar en la factura eléctrica.",
  },
  {
    question: "¿Se puede instalar zonificación en un sistema de aire por conductos ya existente?",
    answer:
      "Sí, en la mayoría de los casos se puede adaptar un sistema de aire acondicionado por conductos mediante la instalación de rejillas motorizadas y un sistema de control centralizado.",
  },
  {
    question: "¿Qué tecnologías modernas incluyen los sistemas de zonificación?",
    answer:
      "Los sistemas actuales se integran con domótica, asistentes de voz, geolocalización y programaciones horarias, lo que permite mayor comodidad y eficiencia.",
  },
  {
    question: "¿Cuánto se puede ahorrar con un sistema de zonificación?",
    answer:
      "El ahorro varía según el uso, pero se estima una reducción en el consumo eléctrico de entre un 20% y un 40% respecto a sistemas tradicionales sin zonificación.",
  },
]

export function FaqsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros sistemas de climatización y zonificación
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">¿No encuentras la respuesta que buscas?</p>
          <a
            href="/contacto"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  )
}
