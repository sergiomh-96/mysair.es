import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Política de Privacidad APP | MYSAir",
  description: "Condiciones de uso y política de privacidad para nuestras aplicaciones móviles y acceso desde dispositivos móviles de MYSAir.",
}

export default function PoliticaPrivacidadAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
