import { Navigation } from "@/components/navigation"
import { AboutHero } from "@/components/about/about-hero"
import { TeamSection } from "@/components/about/team-section"
import { ValuesSection } from "@/components/about/values-section"
import { StatsSection } from "@/components/about/stats-section"

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
