"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Wind, Settings, Fan } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"

export function ProductsPreview() {
  const { t } = useI18n()

  const productCategories = [
    {
      title: t("products_preview.categories.diffusion.title"),
      description: t("products_preview.categories.diffusion.description"),
      icon: Wind,
      image: "/difusion.jpg",
      products: [
        t("products_preview.categories.diffusion.p1"),
        t("products_preview.categories.diffusion.p2"),
        t("products_preview.categories.diffusion.p3"),
      ],
      href: "/productos?categoria=air_diffusion",
    },
    {
      title: t("products_preview.categories.zones.title"),
      description: t("products_preview.categories.zones.description"),
      icon: Settings,
      image: "/sistema-zonas2.png",
      products: [
        t("products_preview.categories.zones.p1"),
        t("products_preview.categories.zones.p2"),
        t("products_preview.categories.zones.p3"),
      ],
      href: "/productos?categoria=smart_systems",
    },
    {
      title: t("products_preview.categories.vmc.title"),
      description: t("products_preview.categories.vmc.description"),
      icon: Fan,
      image: "/VMC_ppal5.png",
      products: [
        t("products_preview.categories.vmc.p1"),
        t("products_preview.categories.vmc.p2"),
        t("products_preview.categories.vmc.p3"),
      ],
      href: "/productos?categoria=vmc",
    },
  ]

  return (
    <section className="bg-gray-50 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl mb-4 text-slate-800 font-medium">
            {t("products_preview.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">{t("products_preview.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {productCategories.map((category, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                </div>

                <p className="text-gray-600 mb-4 text-pretty">{category.description}</p>

                <ul className="space-y-2 mb-6">
                  {category.products.map((product, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                      {product}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href={category.href}>
                    {t("hero.view_products")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/productos">
              {t("products_preview.view_all")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
