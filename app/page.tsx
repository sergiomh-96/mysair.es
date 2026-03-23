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
import { PopupContainer } from "@/components/popup-container"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <PopupContainer />
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
