import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactContent } from "@/components/contact/contact-content"

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
