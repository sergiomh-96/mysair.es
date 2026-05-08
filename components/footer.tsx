"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Youtube } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-0">
            <Link href="/" className="flex items-center">
              <Image src="/images/design-mode/mysair-logo1.png" alt="MYSAir Logo" width={100} height={50} />
            </Link>
            <p className="text-gray-400 text-sm text-pretty">
              {t("footer.description")}
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
            <h3 className="font-semibold mb-4">{t("footer.products")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/productos/difusion-aire" className="hover:text-white transition-colors">
                  {t("nav.products_diffusion")}
                </Link>
              </li>
              <li>
                <Link href="/productos/sistemas-domoticos" className="hover:text-white transition-colors">
                  {t("nav.products_zones")}
                </Link>
              </li>
              <li>
                <Link href="/productos/vmc" className="hover:text-white transition-colors">
                  {t("nav.products_vmc")}
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-white transition-colors">
                  {t("footer.catalog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/conocenos" className="hover:text-white transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  {t("nav.blogs")}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>mysair@mysair.es</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>966 74 44 73</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-300 text-xs uppercase tracking-wider">{t("contact.info.address_fiscal")}</p>
                  <p>C/Mayor, 27</p>
                  <p>30149 El Siscar, Murcia, España</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-300 text-xs uppercase tracking-wider">{t("contact.info.address_factory")}</p>
                  <p>Carretera Nacional N-340</p>
                  <p>03311 La Aparecida, Alicante, España</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <Link href="/aviso-legal" className="text-gray-400 hover:text-white transition-colors">
              {t("footer.legal")}
            </Link>
            <Link href="/politica-cookies" className="text-gray-400 hover:text-white transition-colors">
              {t("footer.cookies")}
            </Link>
          </div>
          <div className="text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} MYSAir. {t("footer.rights")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
