import type { Metadata } from "next"
import type React from "react"
import { JsonLd } from "@/components/seo/json-ld"
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data"

export const metadata: Metadata = {
  title: "Sistemas de Ventilación Mecánica Controlada (VMC) | MYSAir",
  description:
    "Sistemas VMC para garantizar la calidad del aire interior. Soluciones de ventilación eficientes para cumplir con la normativa en proyectos arquitectónicos.",
}

export default function VmcLayout({
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
          { name: "VMC", url: "/productos/vmc" },
        ])}
      />
      {children}
    </>
  )
}
