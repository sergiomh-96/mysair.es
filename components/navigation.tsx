"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/design-mode/mysair-logo1.png"
              alt="MYSAir"
              width={180}
              height={60}
              className="w-auto h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t("nav.home")}
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                {t("nav.products")}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4">
                  <Link
                    href="/productos?categoria=air_diffusion"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-blue-50 rounded"
                  >
                    {t("nav.products_diffusion")}
                  </Link>
                  <Link
                    href="/productos?categoria=smart_systems"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-blue-50 rounded"
                  >
                    {t("nav.products_zones")}
                  </Link>
                  <Link
                    href="/productos?categoria=vmc"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-blue-50 rounded"
                  >
                    {t("nav.products_vmc")}
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/documentacion" className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base">
              {t("nav.documentation")}
            </Link>
            <Link href="/software" className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base">
              {t("nav.software")}
            </Link>
            <Link href="/blogs" className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base">
              {t("nav.blogs")}
            </Link>
            <Link href="/conocenos" className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base">
              {t("nav.about")}
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors text-sm lg:text-base">
              {t("nav.contact")}
            </Link>
          </div>

          {/* CTA & Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <Button asChild>
              <Link href="/contacto">{t("nav.client_area")}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                {t("nav.home")}
              </Link>
              <Link href="/productos" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                {t("nav.products")}
              </Link>
              <Link href="/documentacion" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                {t("nav.documentation")}
              </Link>
              <Link href="/software" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                {t("nav.software")}
              </Link>
              <Link href="/blogs" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                {t("nav.blogs")}
              </Link>
              <Link href="/conocenos" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                {t("nav.about")}
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                {t("nav.contact")}
              </Link>
              <Button asChild className="w-full">
                <Link href="/contacto" onClick={() => setIsOpen(false)}>{t("nav.client_area")}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
