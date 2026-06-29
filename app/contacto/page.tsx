import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactContent } from "@/components/contact/contact-content"

export const metadata: Metadata = {
  title: "Contacto | MYSAir",
  description:
    "Ponte en contacto con MYSAir. Solicita información, presupuestos o soporte técnico para tus proyectos de climatización y zonificación.",
}

export default function ContactoPage() {
  const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY ?? ""

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ContactContent recaptchaSiteKey={recaptchaSiteKey} />
      <Footer />
    </div>
  )
}
