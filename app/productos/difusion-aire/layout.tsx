import type { Metadata } from "next"
import type React from "react"
import { JsonLd } from "@/components/seo/json-ld"
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data"

export const metadata: Metadata = {
  title: "Rejillas de Aire Acondicionado y Sistemas de Difusión | MYSAir",
  description:
    "Fabricantes de rejillas de aire acondicionado, rejillas de impulsión, salidas de aire y sistemas de difusión en aluminio para proyectos de climatización.",
}

export default function DifusionAireLayout({
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
          { name: "Difusión de Aire", url: "/productos/difusion-aire" },
        ])}
      />
      {children}
    </>
  )
}
