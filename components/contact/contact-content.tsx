"use client"

import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { useI18n } from "@/lib/i18n-context"

interface ContactContentProps {
  recaptchaSiteKey: string
}

export function ContactContent({ recaptchaSiteKey }: ContactContentProps) {
  const { t } = useI18n()

  return (
    <main>
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t("contact.header.title")}</h1>
            <p className="text-xl text-gray-600">
              {t("contact.header.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm recaptchaSiteKey={recaptchaSiteKey} />
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>
        </div>
      </div>
    </main>
  )
}
