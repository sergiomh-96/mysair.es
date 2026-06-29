import type { Metadata } from "next"
import type React from "react"

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
  return <>{children}</>
}
