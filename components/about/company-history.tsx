"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n-context"

export function CompanyHistory() {
  const { t } = useI18n()

  const milestones = [
    {
      year: "1995",
      title: t("about.history.m1_title"),
      description: t("about.history.m1_desc"),
    },
    {
      year: "2005",
      title: t("about.history.m2_title"),
      description: t("about.history.m2_desc"),
    },
    {
      year: "2015",
      title: t("about.history.m3_title"),
      description: t("about.history.m3_desc"),
    },
    {
      year: "2020",
      title: t("about.history.m4_title"),
      description: t("about.history.m4_desc"),
    },
    {
      year: "2024",
      title: t("about.history.m5_title"),
      description: t("about.history.m5_desc"),
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("about.history.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("about.history.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className="flex-1">
                  <Card className={`max-w-md ${index % 2 === 0 ? "ml-auto mr-8" : "mr-auto ml-8"}`}>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline dot */}
                <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
