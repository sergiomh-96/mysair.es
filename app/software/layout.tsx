import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Software de Climatización y Cálculo | MYSAir",
  description:
    "Herramientas y software de selección y cálculo para proyectos de climatización. MYS Solver y MYS Draw.",
}

export default function SoftwareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
