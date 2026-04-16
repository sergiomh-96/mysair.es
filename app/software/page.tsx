"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { DiffuserSelector } from "@/components/diffuser-selector"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"

export default function SoftwarePage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
              {t("software.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              {t("software.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <DiffuserSelector />

        <div className="grid md:grid-cols-2 gap-8">
          {/* MYS Solver */}
          <div
            className="rounded-lg p-8 text-white flex flex-col items-center text-center relative overflow-hidden group"
            style={{
              backgroundImage: "url(/images/mys-solver-bg2.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
            <div className="relative z-10">
              <h2 className="text-3xl mb-2 font-black">{t("software.solver_title")}</h2>
              <p className="text-xl mb-4 text-popover">{t("software.solver_subtitle")}</p>
              <p className="max-w-xl mb-6 flex-grow text-card">
                {t("software.solver_desc")}
              </p>
              <Link href="/software/mys-solver">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  {t("software.solver_btn")}
                </Button>
              </Link>
            </div>
          </div>

          {/* MYS Draw */}
          <div
            className="rounded-lg p-8 text-white flex flex-col items-center text-center relative overflow-hidden group"
            style={{
              backgroundImage: "url(/images/mys-draw-bg3.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "400px",
            }}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
            <div className="relative z-10">
              <h2 className="text-3xl mb-2 font-black">{t("software.draw_title")}</h2>
              <p className="text-xl mb-4 text-popover">{t("software.draw_subtitle")}</p>
              <p className="max-w-xl mb-6 flex-grow text-white">
                {t("software.draw_desc")}
              </p>
              <Link href="https://www.mysdraw.es/">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  {t("software.draw_btn")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardContent className="py-12 px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("software.help_title")}</h3>
            <p className="text-lg text-gray-600 mb-8">
              {t("software.help_desc")}
            </p>
            <Link href="/contacto">
              <Button size="lg" className="text-lg px-8">
                {t("software.help_cta")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
