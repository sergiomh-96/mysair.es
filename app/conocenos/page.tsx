import { Navigation } from "@/components/navigation"
import { AboutHero } from "@/components/about/about-hero"
import { CompanyHistory } from "@/components/about/company-history"
import { TeamSection } from "@/components/about/team-section"
import { ValuesSection } from "@/components/about/values-section"
import { StatsSection } from "@/components/about/stats-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <AboutHero />
      <StatsSection />
      <CompanyHistory />
      <ValuesSection />
      <TeamSection />
    </div>
  )
}
