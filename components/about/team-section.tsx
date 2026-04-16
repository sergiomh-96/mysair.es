"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"

export function TeamSection() {
  const { t } = useI18n()

  const team = [
    {
      name: "Carlos Martínez",
      role: t("about.team.r1"),
      description: t("about.team.r1_desc"),
      image: "/professional-businessman-portrait.png",
    },
    {
      name: "Ana García",
      role: t("about.team.r2"),
      description: t("about.team.r2_desc"),
      image: "/professional-businesswoman-portrait.png",
    },
    {
      name: "Miguel Rodríguez",
      role: t("about.team.r3"),
      description: t("about.team.r3_desc"),
      image: "/professional-technician-portrait.png",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        

        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("about.team.join_title")}</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t("about.team.join_desc")}
            </p>
            <Button asChild size="lg">
              <Link href="/contacto">{t("about.team.join_cta")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
