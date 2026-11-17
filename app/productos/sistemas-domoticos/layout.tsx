import type { Metadata } from "next"
import type React from "react"
import { JsonLd } from "@/components/seo/json-ld"
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data"

export const metadata: Metadata = {
  title: "Sistemas de Zonificación de Aire Acondicionado por Conductos | MYSAir",
  description:
    "Sistemas de zonificación de aire acondicionado por conductos. Módulos de control, compuertas de regulación y termostatos para eficiencia energética.",
}

export default function SistemasDomoticosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Inicio", url: "/" },
          { name: "Productos", url: "/productos" },
          { name: "Sistemas Domóticos", url: "/productos/sistemas-domoticos" },
        ])}
      />
      {children}
    </>
  )
}
