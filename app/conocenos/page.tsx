import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { AboutHero } from "@/components/about/about-hero"
import { TeamSection } from "@/components/about/team-section"
import { ValuesSection } from "@/components/about/values-section"
import { StatsSection } from "@/components/about/stats-section"

export const metadata: Metadata = {
  title: "Conócenos | MYSAir",
  description:
    "Descubre la trayectoria, valores y el equipo de MYSAir. Líderes en fabricación y desarrollo de soluciones de climatización inteligente.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <AboutHero />
      <StatsSection />
      <ValuesSection />
      <TeamSection />
    </div>
  )
}
