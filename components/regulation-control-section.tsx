"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Activity, Cpu, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"

export function RegulationControlSection() {
  const { t } = useI18n()

  const solutions = [
    {
      id: "ms201v",
      title: t("regulation_control.rite.title"),
      description: t("regulation_control.rite.description"),
      icon: Cpu,
      features: [
        t("regulation_control.rite.f1"),
        t("regulation_control.rite.f2"),
        t("regulation_control.rite.f3"),
      ],
      color: "text-blue-600",
      bg: "bg-blue-50",
      image: "/vivienda-zonif3.png",
      link: "https://drive.google.com/open?id=1DJAZUA6nJIobNIC6Koj5ra9LHay7uI-v&usp=drive_fs",
      buttonText: t("regulation_control.rite.button"),
    },
    {
      id: "chr",
      title: t("regulation_control.integration.title"),
      description: t("regulation_control.integration.description"),
      icon: Cpu,
      features: [
        t("regulation_control.integration.f1"),
        t("regulation_control.integration.f2"),
        t("regulation_control.integration.f3"),
      ],
      color: "text-orange-600",
      bg: "bg-orange-50",
      image: "/gateway1.jpg",
      buttonText: t("regulation_control.integration.button"),
    },
    {
      id: "ctotal",
      title: t("regulation_control.domotics.title"),
      description: t("regulation_control.domotics.description"),
      icon: Share2,
      features: [
        t("regulation_control.domotics.f1"),
        t("regulation_control.domotics.f2"),
        t("regulation_control.domotics.f3"),
      ],
      color: "text-purple-600",
      bg: "bg-purple-50",
      image: "/integraciones3.png",
      buttonText: t("regulation_control.domotics.button"),
    },
  ]

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("regulation_control.title")}
          </h2>
          <p className="text-lg text-gray-600">{t("regulation_control.description")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {solutions.map((solution) => (
            <Card
              key={solution.id}
              className="group hover:shadow-xl transition-all duration-300 border-none shadow-md overflow-hidden flex flex-col"
            >
              <div className={`h-2 w-full ${solution.bg.replace("bg-", "bg-opacity-100 bg-")}`} />
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={solution.image || "/placeholder.svg"}
                  alt={solution.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-gray-600 mb-6 line-clamp-3">{solution.description}</p>

                <ul className="space-y-2 mb-6 flex-grow">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <Activity className={`h-4 w-4 mr-2 ${solution.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {solution.link ? (
                  <Link href={solution.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-between group-hover:text-blue-600 hover:bg-blue-50 mt-auto"
                    >
                      {solution.buttonText}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-between group-hover:text-blue-600 hover:bg-blue-50 mt-auto"
                  >
                    {solution.buttonText}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
