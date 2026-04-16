"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, Clock, Settings } from "lucide-react"
import { useState } from "react"

import { useI18n } from "@/lib/i18n-context"

export function MobileAppSection() {
  const { t } = useI18n()
  const [isHovering, setIsHovering] = useState(false)

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-chart-3 font-bold text-4xl md:text-6xl text-center">{t("mobile_app.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center text-lg md:text-xl">
            {t("mobile_app.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 items-center max-w-6xl mx-auto gap-8 lg:gap-1.5">
          {/* Phone Mockup */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative">
              <img
                src={isHovering ? "/APP_4.png" : "/APP_1.png"}
                alt="MYSAir App"
                className="object-cover rounded-[3rem] shadow-2xl w-64 h-auto max-w-full lg:h-[480px] lg:w-auto bg-transparent text-transparent shadow-none cursor-pointer transition-all duration-300"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            {/* Key Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("mobile_app.features.remote.title")}</h3>
                  <p className="text-sm text-gray-600">{t("mobile_app.features.remote.description")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("mobile_app.features.monitoring.title")}</h3>
                  <p className="text-sm text-gray-600">
                    {t("mobile_app.features.monitoring.description")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("mobile_app.features.programming.title")}</h3>
                  <p className="text-sm text-gray-600">{t("mobile_app.features.programming.description")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("mobile_app.features.advanced.title")}</h3>
                  <p className="text-sm text-gray-600">{t("mobile_app.features.advanced.description")}</p>
                </CardContent>
              </Card>
            </div>

            {/* App Store Badges */}
            <div className="flex flex-col sm:flex-row justify-start items-center gap-6">
              <Button
                asChild
                className="bg-black hover:bg-gray-800 text-white py-4 lg:py-6 rounded-xl flex items-center text-base lg:text-lg gap-2 px-8 lg:px-12 w-full h-12 sm:w-[275px]"
              >
                <a
                  href="https://apps.apple.com/es/app/mysair-v2-sistema-de-zonas/id6475679706"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="size-8 lg:size-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs lg:text-sm font-extralight">{t("mobile_app.available_on")}</div>
                    <div className="font-medium text-lg lg:text-xl">App Store</div>
                  </div>
                </a>
              </Button>

              <Button
                asChild
                className="bg-black hover:bg-gray-800 text-white py-4 lg:py-6 rounded-xl flex items-center gap-2 px-8 lg:px-12 text-base lg:text-lg w-full h-12 sm:w-[275PX]"
              >
                <a
                  href="https://play.google.com/store/apps/details?id=es.mysair.mysair2&hl=es_419"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="size-7 lg:size-9" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs lg:text-sm font-extralight">{t("mobile_app.available_on")}</div>
                    <div className="font-semibold text-lg lg:text-xl">Google Play</div>
                  </div>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
