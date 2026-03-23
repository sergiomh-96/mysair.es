import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-0">
            <Link href="/" className="flex items-center">
              {/* Added logo here */}
              <Image src="/images/design-mode/mysair-logo1.png" alt="MYSAir Logo" width={100} height={50} />
            </Link>
            <p className="text-gray-400 text-sm text-pretty">
              Especialistas en soluciones integrales de regulación y control de la climatización y ventilación. Difusión
              de aire y sistemas de zonas de alta calidad.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.linkedin.com/company/mysair"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/MYSAIR?locale=es_ES"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/_mysair_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@mysair/featured"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Productos</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/productos/difusion-aire" className="hover:text-white transition-colors">
                  Difusión de Aire
                </Link>
              </li>
              <li>
                <Link href="/productos/sistemas-domoticos" className="hover:text-white transition-colors">
                  Sistemas de Zonas
                </Link>
              </li>
              <li>
                <Link href="/productos/vmc" className="hover:text-white transition-colors">
                  VMC
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-white transition-colors">
                  Catálogo Completo
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/conocenos" className="hover:text-white transition-colors">
                  Conócenos
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>mysair@mysair.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+34 966 74 44 73</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{"La Aparecida, Alicante, España"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <Link href="/aviso-legal" className="text-gray-400 hover:text-white transition-colors">
              Aviso Legal
            </Link>
            <Link href="/politica-cookies" className="text-gray-400 hover:text-white transition-colors">
              Política de Cookies
            </Link>
          </div>
          <div className="text-center text-sm text-gray-400">
            <p>© 2026 MYSAir. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
