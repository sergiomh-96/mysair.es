import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProductsPreview } from "@/components/products-preview"
import { RegulationControlSection } from "@/components/regulation-control-section"
import { MobileAppSection } from "@/components/mobile-app-section"
import { WhyChooseMysair } from "@/components/why-choose-mysair"
import { ClientTestimonials } from "@/components/client-testimonials"
import { FaqsSection } from "@/components/faqs-section"
import { Footer } from "@/components/footer"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import { JsonLd } from "@/components/seo/json-ld"
import { buildFaqSchema } from "@/lib/seo/structured-data"
import esLocale from "@/locales/es.json"

export default function HomePage() {
  const homeFaqs = [
    { question: esLocale.faqs.q1, answer: esLocale.faqs.a1 },
    { question: esLocale.faqs.q2, answer: esLocale.faqs.a2 },
    { question: esLocale.faqs.q3, answer: esLocale.faqs.a3 },
    { question: esLocale.faqs.q4, answer: esLocale.faqs.a4 },
    { question: esLocale.faqs.q5, answer: esLocale.faqs.a5 },
  ]

  return (
    <main className="min-h-screen">
      <JsonLd data={buildFaqSchema(homeFaqs)} />
      <Navigation />
      <HeroSection />
      <ScrollRevealWrapper direction="up">
        <ProductsPreview />
      </ScrollRevealWrapper>
      <ScrollRevealWrapper direction="up" delay={100}>
        <RegulationControlSection />
      </ScrollRevealWrapper>
      <ScrollRevealWrapper direction="up" delay={200}>
        <MobileAppSection />
      </ScrollRevealWrapper>
      <ScrollRevealWrapper direction="up" delay={300}>
        <WhyChooseMysair />
      </ScrollRevealWrapper>
      <ScrollRevealWrapper direction="up" delay={100}>
        <ClientTestimonials />
      </ScrollRevealWrapper>
      <ScrollRevealWrapper direction="up" delay={200}>
        <FaqsSection />
      </ScrollRevealWrapper>
      <Footer />
    </main>
  )
}
