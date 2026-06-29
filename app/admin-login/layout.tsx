import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Iniciar Sesión Admin | MYSAir",
  description: "Acceso al panel de administración de MYSAir.",
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
