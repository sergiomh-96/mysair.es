import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Compatibilidad de Climatizadores | MYSAir",
  description:
    "Consulta la compatibilidad de tus unidades de aire acondicionado con los sistemas de control y pasarelas de comunicación MYSAir.",
}

export default function CompatibilidadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
