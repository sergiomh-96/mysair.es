"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Wind, Home, Zap } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

import { useI18n } from "@/lib/i18n-context"

export function HeroSection() {
  const { t } = useI18n()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = ["/chica+rejilla2.png", "/salon+movil.png"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl text-balance font-bold tracking-normal text-left leading-[1] text-foreground opacity-80">
                {t("hero.title")}
              </h1>
              <p className="text-gray-600 text-pretty tracking-wide text-2xl font-medium leading-9 text-justify">
                {t("hero.description")}
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wind className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t("nav.products_diffusion")}</h3>
                  <p className="text-sm text-gray-600">{t("nav.products_diffusion")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t("nav.products_zones")}</h3>
                  <p className="text-sm text-gray-600">{t("common.language")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t("hero.efficiency")}</h3>
                  <p className="text-sm text-gray-600">{t("hero.energy_saving")}</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/productos">
                  {t("hero.view_products")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden">
              <img
                key={currentImageIndex}
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt="Sistema de climatización MYSAir"
                className="w-full h-full object-cover transition-opacity duration-500 animate-subtle-zoom"
              />
            </div>
            {/* Floating cards */}
          </div>
        </div>
      </div>
    </section>
  )
}
