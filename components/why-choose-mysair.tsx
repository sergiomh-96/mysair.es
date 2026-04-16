"use client"

import { CheckCircle, Award, Users, Wrench } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function WhyChooseMysair() {
  const { t } = useI18n()

  const reasons = [
    {
      icon: Award,
      title: t("why_choose.reasons.experience.title"),
      description: t("why_choose.reasons.experience.description"),
    },
    {
      icon: CheckCircle,
      title: t("why_choose.reasons.quality.title"),
      description: t("why_choose.reasons.quality.description"),
    },
    {
      icon: Users,
      title: t("why_choose.reasons.team.title"),
      description: t("why_choose.reasons.team.description"),
    },
    {
      icon: Wrench,
      title: t("why_choose.reasons.service.title"),
      description: t("why_choose.reasons.service.description"),
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("why_choose.title")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("why_choose.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
