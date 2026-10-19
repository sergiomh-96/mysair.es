import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mysair.es"),
  title: "MYSDRAW Online | Software Gratuito de Diseño HVAC, Suelo Radiante y VMC - MYSAir",
  description:
    "Descubre MYSDRAW Online: software 100% en la nube y gratuito para el cálculo de suelo radiante (UNE-EN 1264), redes de conductos de climatización y ventilación mecánica controlada VMC (CTE DB-HS3). Genera planos técnicos, informes PDF y presupuestos PVP al instante.",
  keywords: [
    "MYSDRAW",
    "MYSDRAW Online",
    "software HVAC online",
    "cálculo suelo radiante",
    "UNE-EN 1264",
    "VMC",
    "CTE DB-HS3",
    "red de conductos climatización",
    "difusión aire",
    "software climatización gratuito",
    "MYSAir",
  ],
  alternates: {
    canonical: "https://www.mysair.es/software/mysdraw",
  },
  openGraph: {
    title: "MYSDRAW Online | Software Gratuito de Diseño HVAC, Suelo Radiante y VMC",
    description:
      "Software 100% online y gratuito para el diseño de instalaciones HVAC. Cálculo de conductos, suelo radiante y VMC con informes en PDF inmediatos.",
    url: "https://www.mysair.es/software/mysdraw",
    siteName: "MYSAir",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/mys-draw-bg3.jpg",
        width: 1200,
        height: 630,
        alt: "MYSDRAW Online - Software de diseño HVAC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MYSDRAW Online | Software Gratuito de Diseño HVAC",
    description:
      "Cálculo de suelo radiante UNE-EN 1264, redes de conductos y VMC CTE DB-HS3 100% online y gratuito.",
    images: ["/images/mys-draw-bg3.jpg"],
  },
}

export default function MysDrawLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
