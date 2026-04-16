"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Award, Wrench } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function StatsSection() {
  const { t } = useI18n()

  const stats = [
    {
      icon: Building2,
      number: "500+",
      label: t("about.stats.projects"),
      description: t("about.stats.projects_desc"),
    },
    {
      icon: Users,
      number: "25+",
      label: t("about.stats.years"),
      description: t("about.stats.years_desc"),
    },
    {
      icon: Award,
      number: "98%",
      label: t("about.stats.satisfaction"),
      description: t("about.stats.satisfaction_desc"),
    },
    {
      icon: Wrench,
      number: "5+",
      label: t("about.stats.paises"),
      description: t("about.stats.paises_desc"),
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("about.stats.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("about.stats.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
