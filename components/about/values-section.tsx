"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lightbulb, Heart, Leaf } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function ValuesSection() {
  const { t } = useI18n()

  const values = [
    {
      icon: Shield,
      title: t("about.values.v1_title"),
      description: t("about.values.v1_desc"),
    },
    {
      icon: Lightbulb,
      title: t("about.values.v2_title"),
      description: t("about.values.v2_desc"),
    },
    {
      icon: Heart,
      title: t("about.values.v3_title"),
      description: t("about.values.v3_desc"),
    },
    {
      icon: Leaf,
      title: t("about.values.v4_title"),
      description: t("about.values.v4_desc"),
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("about.values.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("about.values.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
