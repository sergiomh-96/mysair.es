/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
 
  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      // 1. Reglas específicas para PDFs concretos (deben ir primero)
      {
        source: "/wp-content/uploads/2020/04/MR01_V20.pdf",
        destination: "/productos/mr01",
        permanent: true,
      },
      {
        source: "/wp-content/uploads/2020/04/MA35_V20.pdf",
        destination: "/productos/ma35",
        permanent: true,
      },
      {
        source: "/wp-content/uploads/2021/08/Manual_HARMONY_radio_v1.0.pdf",
        destination: "/productos/termostato_vesta",
        permanent: true,
      },
      // 2. Reglas globales con comodines (wildcards) para atrapar otros PDFs antiguos
      {
        source: "/wp-content/uploads/:year/:month/:filename.pdf",
        destination: "/productos",
        permanent: true,
      },
      {
        source: "/cloud/descargas_mysair/Catalogo/Dossier/:filename.pdf",
        destination: "/productos",
        permanent: true,
      },
    ]
  },
}

export default nextConfig