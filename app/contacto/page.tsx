import { Navigation } from "@/components/navigation"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { ContactMap } from "@/components/contact/contact-map"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  // Read env var server-side and pass it as a prop to the client component
  const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY ?? ""

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">Contacta con Nosotros</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Estamos aquí para ayudarte con tu proyecto de climatización. Contacta con nuestros expertos para recibir
              asesoramiento personalizado.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <ContactForm recaptchaSiteKey={recaptchaSiteKey} />
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <ContactInfo />
            <ContactMap />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
