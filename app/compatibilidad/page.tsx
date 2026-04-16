"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, ExternalLink, Info, CheckCircle2, ChevronRight, Image as ImageIcon, RotateCcw, Check, ChevronsUpDown, ChevronLeft } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"

interface AirCompatibility {
  id: number
  brand: string
  indoor_unit_ref: string
  gateway_ref: string
  connector: string
  manual_url: string
  observations: string
  gateway_image_url: string
  remote_image_url: string
}

interface ImageItem {
  url: string
  label: string
}

// Sub-component for Multiple Images Gallery with Labels
function ImageGallery({ imageUrls, alt, type = "gateway" }: { imageUrls: string, alt: string, type?: "gateway" | "remote" }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Parse URLs and Labels (supports format: url1|label1, url2|label2)
  const images: ImageItem[] = imageUrls 
    ? imageUrls.split(',').map(segment => {
        const [url, label] = segment.split('|').map(s => s.trim())
        return { url, label: label || "" }
      }).filter(item => item.url)
    : []
  
  if (images.length === 0) {
    return (
      <div className="w-full h-full bg-slate-100 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
        <ImageIcon className="h-12 w-12 text-slate-300 mb-2" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Image</span>
      </div>
    )
  }

  const currentItem = images[currentIndex]

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative w-full h-full group flex flex-col items-center justify-center">
      <div className="relative w-full h-full min-h-[220px]">
        <Image 
          src={currentItem.url} 
          alt={`${alt} - ${currentItem.label || 'Image'}`}
          fill
          className={cn(
            "object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 ease-out",
            type === "gateway" ? "group-hover:scale-110" : "group-hover:scale-105"
          )}
        />
      </div>
      
      {/* Dynamic Label Header */}
      {currentItem.label && (
        <div className="absolute top-0 right-0 z-10">
          <Badge className="bg-white/90 text-gray-900 border-none shadow-sm backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-bl-xl rounded-tr-none py-1.5 px-3">
            {currentItem.label}
          </Badge>
        </div>
      )}
      
      {images.length > 1 && (
        <>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevImage}
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border-none shadow-md pointer-events-auto hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextImage}
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border-none shadow-md pointer-events-auto hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/5 backdrop-blur-md rounded-full z-20">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  idx === currentIndex ? "bg-blue-600 w-4" : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function CompatibilityPage() {
  const { t } = useI18n()
  const supabase = createBrowserSupabaseClient()
  const resultsRef = useRef<HTMLDivElement>(null)
  
  const [brands, setBrands] = useState<string[]>([])
  const [references, setReferences] = useState<string[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedReference, setSelectedReference] = useState<string>("all")
  const [generalSearch, setGeneralSearch] = useState("")
  
  const [results, setResults] = useState<AirCompatibility[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 5

  // Combobox states
  const [openBrands, setOpenBrands] = useState(false)
  const [openRefs, setOpenRefs] = useState(false)

  // Initial fetch: Brands (Using loose index scan logic to get ALL unique brands)
  useEffect(() => {
    async function fetchBrands() {
      try {
        const uniqueBrandList: string[] = []
        let lastBrand: string | null = null
        
        // This loop fetches unique brands one by one using the index efficiently
        // It prevents hitting the 1000 row limit of a single query while getting DISTINCT values
        while (true) {
          let query = supabase
            .from('air_compatibility')
            .select('brand')
            .order('brand', { ascending: true })
            .limit(1)
          
          if (lastBrand) {
            query = query.gt('brand', lastBrand)
          }
          
          const { data, error } = await query
          
          if (error) {
            console.error("Error individual brand fetch:", error)
            break
          }
          
          if (data && data.length > 0) {
            lastBrand = data[0].brand
            uniqueBrandList.push(lastBrand)
          } else {
            break // No more brands
          }
          
          // Safety break to prevent infinite loop (unlikely given indexed gt)
          if (uniqueBrandList.length > 200) break 
        }
        
        if (uniqueBrandList.length > 0) {
          setBrands(uniqueBrandList)
        } else {
            // Fallback to simple fetch if direct scan failed or returned nothing
            const { data } = await supabase.from('air_compatibility').select('brand').limit(1000)
            if (data) {
                const fallbackBrands = Array.from(new Set(data.map(item => item.brand))).sort()
                setBrands(fallbackBrands)
            }
        }
      } catch (err) {
        console.error("Error fetching brands:", err)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchBrands()
  }, [supabase])

  // Fetch References based on selected brand
  useEffect(() => {
    async function fetchReferences() {
      if (selectedBrand === "all") {
        setReferences([])
        return
      }
      
      try {
        // For references within a brand, we just fetch with a generous limit
        // since usually one brand doesn't have > 5000 models, and they are unique
        let query = supabase.from('air_compatibility')
          .select('indoor_unit_ref')
          .eq('brand', selectedBrand)
          .order('indoor_unit_ref', { ascending: true })
          .limit(2000)
        
        const { data, error } = await query
        
        if (data) {
          const uniqueRefs = Array.from(new Set(data.map(item => item.indoor_unit_ref))).sort()
          setReferences(uniqueRefs)
          if (selectedReference !== "all" && !uniqueRefs.includes(selectedReference)) {
            setSelectedReference("all")
          }
        }
      } catch (err) {
        console.error("Error fetching references:", err)
      }
    }
    fetchReferences()
  }, [selectedBrand, supabase, selectedReference])

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    setCurrentPage(1) // Reset to first page on new search
    
    try {
      let query = supabase.from('air_compatibility').select('*')
      
      if (selectedBrand && selectedBrand !== "all") {
        query = query.eq('brand', selectedBrand)
      }
      
      if (selectedReference && selectedReference !== "all") {
        query = query.eq('indoor_unit_ref', selectedReference)
      }

      if (generalSearch) {
        query = query.or(`brand.ilike.%${generalSearch}%,indoor_unit_ref.ilike.%${generalSearch}%`)
      }
      
      // Order search results for consistency
      query = query.order('brand').order('indoor_unit_ref')
      
      const { data, error } = await query
      
      if (data) {
        setResults(data)
      } else if (error) {
        console.error("Search error:", error)
        setResults([])
      }
    } catch (err) {
      console.error("Error during search:", err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setSelectedBrand("all")
    setSelectedReference("all")
    setGeneralSearch("")
    setResults([])
    setCurrentPage(1)
  }

  // Pagination Logic
  const totalPages = Math.ceil(results.length / resultsPerPage)
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-white border-b py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollRevealWrapper>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Herramienta de Compatibilidad CTOTAL
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Identifica la pasarela de comunicación MYSAir correcta para la integración de tu sistema de climatización.
            </p>
          </ScrollRevealWrapper>
        </div>
      </section>

      {/* Advanced Search Section */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-none overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
               <div className="flex items-center gap-2 text-white">
                 <Search className="h-5 w-5" />
                 <span className="font-semibold uppercase tracking-wider text-sm">Parámetros de Búsqueda</span>
               </div>
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={resetFilters}
                 className="text-blue-100 hover:text-white hover:bg-blue-700 transition-colors"
               >
                 <RotateCcw className="h-4 w-4 mr-2" />
                 Restablecer
               </Button>
            </div>
            
            <CardContent className="p-6 md:p-10 bg-white">
              <form onSubmit={handleSearch} className="space-y-8">
                {/* General Search Input */}
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-500 uppercase tracking-tight ml-1">Búsqueda Rápida</label>
                   <div className="relative">
                     <Input 
                       placeholder="Marca o Referencia (ej. Daikin FTXM...)"
                       value={generalSearch}
                       onChange={(e) => setGeneralSearch(e.target.value)}
                       className="pl-12 h-14 bg-slate-50 border-gray-100 text-lg focus:ring-blue-500 focus:border-blue-500 transition-all rounded-xl"
                     />
                     <Search className="absolute left-4 top-4.5 h-6 w-6 text-gray-400" />
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-2">
                  {/* Brand Searchable Select */}
                  <div className="space-y-3 flex flex-col">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-tight ml-1">Fabricante / Marca</label>
                    <Popover open={openBrands} onOpenChange={setOpenBrands}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openBrands}
                          className="h-14 justify-between bg-white border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all px-4 font-normal text-gray-600"
                        >
                          <span className="truncate">
                            {selectedBrand === "all" 
                              ? "Filtro: Todos" 
                              : brands.find((brand) => brand === selectedBrand)}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar fabricante..." />
                          <CommandList>
                            <CommandEmpty>No se encontró fabricante.</CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-y-auto">
                              <CommandItem
                                value="all"
                                onSelect={() => {
                                  setSelectedBrand("all")
                                  setOpenBrands(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedBrand === "all" ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Filtro: Todos
                              </CommandItem>
                              {brands.map((brand) => (
                                <CommandItem
                                  key={brand}
                                  value={brand}
                                  onSelect={() => {
                                    setSelectedBrand(brand === selectedBrand ? "all" : brand)
                                    setOpenBrands(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedBrand === brand ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {brand}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Reference Searchable Select */}
                  <div className="space-y-3 flex flex-col">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-tight ml-1">Modelo de Unidad Interior</label>
                    <Popover open={openRefs} onOpenChange={setOpenRefs}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openRefs}
                          disabled={selectedBrand === "all"}
                          className="h-14 justify-between bg-white border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all px-4 font-normal text-gray-600 disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                          <span className="truncate">
                            {selectedBrand === "all" 
                              ? "Selecciona primero una marca" 
                              : selectedReference === "all"
                                ? "Filtro: Todos los modelos"
                                : references.find((ref) => ref === selectedReference) || selectedReference}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar modelo..." />
                          <CommandList>
                            <CommandEmpty>No se encontró el modelo.</CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-y-auto">
                              <CommandItem
                                value="all"
                                onSelect={() => {
                                  setSelectedReference("all")
                                  setOpenRefs(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedReference === "all" ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Filtro: Todos los modelos
                              </CommandItem>
                              {references.map((ref) => (
                                <CommandItem
                                  key={ref}
                                  value={ref}
                                  onSelect={() => {
                                    setSelectedReference(ref === selectedReference ? "all" : ref)
                                    setOpenRefs(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedReference === ref ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {ref}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-center">
                  <Button type="submit" className="px-12 h-14 bg-blue-600 hover:bg-blue-700 text-lg font-bold rounded-xl shadow-lg shadow-blue-200 transition-all group" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Consultando...
                      </>
                    ) : (
                      <>
                        <Search className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Consultar Compatibilidad
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 pb-24" ref={resultsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Configuración Recomendada</h2>
                  <p className="text-gray-500 mt-1">Sistemas MYSAir compatibles con tu instalación</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1 text-xs font-bold bg-slate-50 text-slate-600 border-slate-200 rounded-lg">
                    Página {currentPage} de {totalPages}
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-md font-bold bg-blue-50 text-blue-700 border-blue-100 rounded-lg">
                    {results.length} resultados encontrados
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {currentResults.map((result) => (
                  <ScrollRevealWrapper key={result.id}>
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-none shadow-xl group">
                      <div className="grid lg:grid-cols-5 h-full">
                        {/* Technical Info */}
                        <div className="p-8 lg:col-span-2 bg-white flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-6">
                              <div className="bg-green-100 p-1 rounded-full">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              </div>
                              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">{result.brand}</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{result.indoor_unit_ref}</h3>
                            <p className="text-sm text-gray-400 mb-8 font-semibold uppercase tracking-widest">Modelo Identificado</p>
                            
                            <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
                                  <Info className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Pasarela de Comunicación</p>
                                  <p className="text-xl font-black text-gray-900">{result.gateway_ref}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-4">
                                <div className="bg-slate-100 p-3 rounded-2xl">
                                  <ChevronRight className="h-6 w-6 text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Puerto / Conector</p>
                                  <p className="text-lg font-bold text-gray-700">{result.connector || 'Universal / IR'}</p>
                                </div>
                              </div>
                            </div>

                            {result.observations && (
                              <div className="mt-8 p-5 bg-amber-50 rounded-2xl border-l-8 border-amber-400">
                                <p className="text-[10px] text-amber-700 uppercase font-black tracking-widest mb-2">Notas de Instalación</p>
                                <p className="text-sm text-amber-900 leading-relaxed font-medium">"{result.observations}"</p>
                              </div>
                            )}
                          </div>
                          
                          {result.manual_url && (
                            <Button asChild className="mt-10 w-full h-14 bg-gray-900 hover:bg-black text-white text-md font-bold rounded-xl transition-all shadow-xl shadow-gray-200">
                              <a href={result.manual_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-5 w-5" />
                                Descargar Manual
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        {/* Images side - Large Display */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 bg-slate-50 border-l border-gray-100">
                          {/* Gateway Image Gallery */}
                          <div className="p-10 flex flex-col items-center justify-between text-center border-b sm:border-b-0 sm:border-r border-gray-200 bg-gradient-to-b from-slate-50 to-white">
                             <div className="w-full">
                               <Badge variant="outline" className="mb-8 px-4 py-1 text-[10px] uppercase font-black tracking-widest border-slate-200 text-slate-400">Imagen del Dispositivo</Badge>
                             </div>
                             
                             <div className="relative w-full aspect-square max-w-[220px] mb-8">
                               <ImageGallery imageUrls={result.gateway_image_url} alt={result.gateway_ref} type="gateway" />
                             </div>
                             
                             <div className="bg-white px-6 py-2 rounded-2xl shadow-md border border-slate-100">
                               <p className="text-sm font-black text-gray-900">{result.gateway_ref}</p>
                             </div>
                          </div>
                          
                          {/* Remote Image Gallery */}
                          <div className="p-10 flex flex-col items-center justify-between text-center bg-white sm:bg-transparent">
                             <div className="w-full">
                               <Badge variant="outline" className="mb-8 px-4 py-1 text-[10px] uppercase font-black tracking-widest border-slate-200 text-slate-400">Referencia Mando Original</Badge>
                             </div>
                             
                             <div className="relative w-full aspect-[2/3] max-w-[160px] mb-8">
                               <ImageGallery imageUrls={result.remote_image_url} alt="Remote control" type="remote" />
                             </div>
                             
                             <div className="flex flex-col gap-1">
                               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Contraste con su equipo actual</p>
                               <p className="text-[10px] text-gray-300 font-bold italic">Galería Técnica</p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </ScrollRevealWrapper>
                ))}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="mt-12 py-6 border-t font-semibold">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) handlePageChange(currentPage - 1)
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handlePageChange(page)
                                }}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null
                      })}

                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) handlePageChange(currentPage + 1)
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-widest">
                    Página {currentPage} • Resultados {indexOfFirstResult + 1}-{Math.min(indexOfLastResult, results.length)} de {results.length}
                  </p>
                </div>
              )}
            </div>
          ) : (
            !loading && !initialLoading && (generalSearch || selectedBrand !== "all" || selectedReference !== "all") && (
              <div className="text-center py-24 bg-white rounded-3xl shadow-xl border-2 border-dashed border-slate-200 max-w-3xl mx-auto px-8">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Search className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Sin coincidencias detectadas</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">No se han detectado coincidencias exactas para este modelo. Por favor, contacte con nuestro soporte técnico para un estudio personalizado.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold">
                    <Link href="/contacto">Solicitar Ayuda Técnica</Link>
                  </Button>
                  <Button variant="outline" size="lg" onClick={resetFilters} className="rounded-xl px-8 font-bold">
                    Ver Todos los Equipos
                  </Button>
                </div>
              </div>
            )
          )}
          
          {!generalSearch && selectedBrand === "all" && selectedReference === "all" && results.length === 0 && !loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
               <ScrollRevealWrapper delay={100}>
                 <Card className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white border-none h-full shadow-2xl relative overflow-hidden group">
                   <div className="absolute -right-10 -top-10 bg-white/10 w-40 h-40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                   <CardHeader className="pb-2">
                     <CardTitle className="flex items-center gap-3 text-xl font-black">
                       <div className="bg-white/20 p-2 rounded-xl">
                        <Info className="h-6 w-6" />
                       </div>
                       Procedimiento de Búsqueda
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-blue-100 text-sm leading-relaxed font-medium">
                       Utilice el buscador rápido para localizar su modelo o use los selectores por fabricante para filtrar de forma escalonada.
                     </p>
                   </CardContent>
                 </Card>
               </ScrollRevealWrapper>

               <ScrollRevealWrapper delay={200}>
                 <Card className="bg-white border-none shadow-xl h-full border-t-8 border-t-green-500 rounded-3xl">
                   <CardHeader className="pb-2">
                     <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-900">
                       <div className="bg-green-50 p-2 rounded-xl">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                       </div>
                       Integración Certificada
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-gray-500 text-sm leading-relaxed font-medium">
                       Las pasarelas CTOTAL garantizan una integración bidireccional perfecta, permitiendo el control total de las funciones nativas del fabricante.
                     </p>
                   </CardContent>
                 </Card>
               </ScrollRevealWrapper>

               <ScrollRevealWrapper delay={300}>
                 <Card className="bg-white border-none shadow-xl h-full border-t-8 border-t-blue-500 rounded-3xl">
                   <CardHeader className="pb-2">
                     <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-900">
                       <div className="bg-blue-50 p-2 rounded-xl">
                        <ImageIcon className="h-6 w-6 text-blue-500" />
                       </div>
                       Identificación Técnica
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-gray-500 text-sm leading-relaxed font-medium">
                       Incluimos referencias visuales de los controles remotos originales para facilitar la identificación del protocolo de comunicación correcto.
                     </p>
                   </CardContent>
                 </Card>
               </ScrollRevealWrapper>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
