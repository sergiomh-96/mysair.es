"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

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
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                Productos
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4">
                  <Link
                    href="/productos?categoria=air_diffusion"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-blue-50 rounded"
                  >
                    Difusión de Aire
                  </Link>
                  <Link
                    href="/productos?categoria=smart_systems"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-blue-50 rounded"
                  >
                    Sistemas de Zonas
                  </Link>
                  <Link
                    href="/productos?categoria=vmc"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-blue-50 rounded"
                  >
                    VMC
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/documentacion" className="text-gray-700 hover:text-blue-600 transition-colors">
              Documentación
            </Link>
            <Link href="/software" className="text-gray-700 hover:text-blue-600 transition-colors">
              Software
            </Link>
            <Link href="/blogs" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blogs
            </Link>
            <Link href="/conocenos" className="text-gray-700 hover:text-blue-600 transition-colors">
              Conócenos
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contacto
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/contacto">Area Clientes</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Inicio
              </Link>
              <Link href="/productos" className="text-gray-700 hover:text-blue-600">
                Productos
              </Link>
              <Link href="/documentacion" className="text-gray-700 hover:text-blue-600">
                Documentación
              </Link>
              <Link href="/software" className="text-gray-700 hover:text-blue-600">
                Software
              </Link>
              <Link href="/blogs" className="text-gray-700 hover:text-blue-600">
                Blogs
              </Link>
              <Link href="/conocenos" className="text-gray-700 hover:text-blue-600">
                Conócenos
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-blue-600">
                Contacto
              </Link>
              <Button asChild className="w-full">
                <Link href="/contacto">Solicitar Presupuesto</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
