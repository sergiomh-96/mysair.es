"use client"

import { useI18n } from "@/lib/i18n-context"

export function BlogHeader() {
  const { t } = useI18n()

  return (
    <div className="mb-8">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t("blog.title")}</h1>
      <p className="text-xl text-gray-600 text-pretty">
        {t("blog.subtitle")}
      </p>
    </div>
  )
}
