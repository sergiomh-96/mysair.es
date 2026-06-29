import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Aviso Legal | MYSAir",
  description: "Términos y condiciones legales de uso del sitio web oficial de MYSAir.",
}

export default function AvisoLegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
