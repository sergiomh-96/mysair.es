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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [searchMode, setSearchMode] = useState<"quick" | "advanced">("quick")
  const [suggestions, setSuggestions] = useState<AirCompatibility[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionPage, setSuggestionPage] = useState(0)
  const [hasMoreSuggestions, setHasMoreSuggestions] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const suggestionListRef = useRef<HTMLDivElement>(null)
  const isSelectingSuggestion = useRef(false)

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

  // Live Suggestions logic for Quick Search with Infinite Scroll
  useEffect(() => {
    if (isSelectingSuggestion.current) {
      isSelectingSuggestion.current = false
      return
    }

    const timer = setTimeout(async () => {
      if (searchMode === "quick" && generalSearch.length >= 2) {
        setSuggestionPage(0)
        setHasMoreSuggestions(true)
        fetchBatchSuggestions(0, true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [generalSearch, searchMode])

  async function fetchBatchSuggestions(page: number, isNewSearch: boolean = false) {
    if (!hasMoreSuggestions && !isNewSearch) return
    
    try {
      if (!isNewSearch) setIsFetchingMore(true)
      
      const normalizedSearch = generalSearch.replace(/[0O]/gi, '_')
      const pageSize = 8
      const from = page * pageSize
      const to = from + pageSize - 1
      
      const { data, error } = await supabase
        .from('air_compatibility')
        .select('brand, indoor_unit_ref')
        .or(`brand.ilike.%${normalizedSearch}%,indoor_unit_ref.ilike.%${normalizedSearch}%`)
        .range(from, to)
      
      if (data) {
        if (isNewSearch) {
          setSuggestions(data as any[])
          setShowSuggestions(true)
        } else {
          setSuggestions(prev => [...prev, ...(data as any[])])
        }
        setHasMoreSuggestions(data.length === pageSize)
      }
    } catch (err) {
      console.error("Error fetching batch suggestions:", err)
    } finally {
      setIsFetchingMore(false)
    }
  }

  const handleSuggestionScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop <= clientHeight + 50 && !isFetchingMore && hasMoreSuggestions) {
      const nextPage = suggestionPage + 1
      setSuggestionPage(nextPage)
      fetchBatchSuggestions(nextPage)
    }
  }

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    setCurrentPage(1) // Reset to first page on new search
    setShowSuggestions(false) // Hide dropdown on search
    
    try {
      let query = supabase.from('air_compatibility').select('*')
      
      if (searchMode === "advanced") {
        if (selectedBrand && selectedBrand !== "all") {
          query = query.eq('brand', selectedBrand)
        }
        
        if (selectedReference && selectedReference !== "all") {
          query = query.eq('indoor_unit_ref', selectedReference)
        }
      }

      if (searchMode === "quick" && generalSearch) {
        // Apply 0/O normalization logic here too for the final search
        const normalizedSearch = generalSearch.replace(/[0O]/gi, '_')
        query = query.or(`brand.ilike.%${normalizedSearch}%,indoor_unit_ref.ilike.%${normalizedSearch}%`)
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
      // Scroll to results after a short delay to allow DOM to update
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
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
      <section className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollRevealWrapper>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Herramienta de Compatibilidad CTOTAL
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Identifica la pasarela de comunicación MYSAir correcta para la integración de tu sistema de climatización.
            </p>
          </ScrollRevealWrapper>
        </div>
      </section>

      {/* Advanced Search Section */}
      <section className="py-6 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-none">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
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
            
            <CardContent className="p-6 md:p-8 bg-white">
              <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "quick" | "advanced")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 h-11 bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger value="quick" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                    Búsqueda Rápida
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                    Filtrado por Marca / Modelo
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSearch} className="space-y-6">
                  <TabsContent value="quick" className="mt-0 space-y-4">
                    {/* General Search Input */}
                    <div className="space-y-2 relative">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Introduzca marca o referencia</label>
                      <div className="relative">
                        <Input 
                          placeholder="Ej. Daikin FTXM o Mitsubishi MSZ..."
                          value={generalSearch}
                          onChange={(e) => setGeneralSearch(e.target.value)}
                          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          className="pl-11 h-12 bg-slate-50 border-gray-100 text-base focus:ring-blue-500 focus:border-blue-500 transition-all rounded-xl"
                        />
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                      
                      {/* Suggestions Dropdown with Infinite Scroll */}
                      {showSuggestions && suggestions.length > 0 && (
                        <Card className="absolute z-[100] w-full mt-1 shadow-2xl border-gray-100 overflow-hidden">
                          <div 
                            className="max-h-64 overflow-y-auto bg-white"
                            onScroll={handleSuggestionScroll}
                          >
                            {suggestions.map((s, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  isSelectingSuggestion.current = true
                                  setGeneralSearch(s.indoor_unit_ref)
                                  setSuggestions([])
                                  setShowSuggestions(false)
                                  setTimeout(() => handleSearch(), 50)
                                }}
                                className="w-full text-left px-5 py-4 hover:bg-blue-50 border-b border-slate-50 last:border-0 transition-colors group flex items-center justify-between"
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{s.indoor_unit_ref}</span>
                                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{s.brand}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                            {isFetchingMore && (
                              <div className="p-4 text-center border-t border-slate-50">
                                <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-500" />
                              </div>
                            )}
                          </div>
                        </Card>
                      )}
                      
                      <p className="text-xs text-gray-400 ml-1">Búsqueda inteligente con corrección de caracteres (0/O).</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="mt-0 space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Brand Searchable Select */}
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Fabricante / Marca</label>
                        <Popover open={openBrands} onOpenChange={setOpenBrands}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openBrands}
                              className="h-12 justify-between bg-white border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all px-4 font-normal text-gray-600"
                            >
                              <span className="truncate">
                                {selectedBrand === "all" 
                                  ? "Seleccione Fabricante" 
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
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Modelo de Unidad Interior</label>
                        <Popover open={openRefs} onOpenChange={setOpenRefs}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openRefs}
                              disabled={selectedBrand === "all"}
                              className="h-12 justify-between bg-white border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all px-4 font-normal text-gray-600 disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  </TabsContent>
                  
                  <div className="pt-2 flex flex-col items-center gap-4">
                    <Button type="submit" className="px-10 h-12 bg-blue-600 hover:bg-blue-700 text-base font-bold rounded-xl shadow-lg shadow-blue-200 transition-all group" disabled={loading}>
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
                    
                    <p className="text-sm text-gray-500">
                      ¿No encuentra su modelo?{' '}
                      <Link href="/contacto" className="text-blue-600 font-bold hover:underline">
                        Contáctenos si no encuentra el modelo de su unidad interior
                      </Link>
                    </p>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 pb-16" ref={resultsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-4 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Configuración Recomendada</h2>
                  <p className="text-gray-400 text-sm mt-1">Sistemas MYSAir compatibles con tu instalación</p>
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
                        <div className="p-6 lg:col-span-2 bg-white flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="bg-green-100 p-1 rounded-full">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="text-[15px] font-black uppercase tracking-[0.2em] text-blue-600">{result.brand}</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-1 leading-tight">{result.indoor_unit_ref}</h3>
                            <p className="text-[10px] text-gray-400 mb-4 font-semibold uppercase tracking-widest">Modelo Identificado</p>
                            
                            <div className="space-y-4">
                              <div className="flex items-start gap-4">
                                <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100">
                                  <Info className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Pasarela de Comunicación</p>
                                  <p className="text-lg font-black text-gray-900">{result.gateway_ref}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-4">
                                <div className="bg-slate-100 p-2 rounded-xl">
                                  <ChevronRight className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Puerto / Conector</p>
                                  <p className="text-base font-bold text-gray-700">{result.connector || 'Universal / IR'}</p>
                                </div>
                              </div>
                            </div>

                            {result.observations && (
                              <div className="mt-4 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                                <p className="text-[9px] text-amber-700 uppercase font-black tracking-widest mb-1">Notas de Instalación</p>
                                <p className="text-xs text-amber-900 leading-relaxed font-medium">"{result.observations}"</p>
                              </div>
                            )}
                          </div>
                          
                          {result.manual_url && (
                            <Button asChild className="mt-6 w-full h-11 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-xl shadow-gray-200">
                              <a href={result.manual_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Descargar Manual
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        {/* Images side - Large Display */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 bg-slate-50 border-l border-gray-100">
                          {/* Gateway Image Gallery */}
                          <div className="p-6 flex flex-col items-center justify-between text-center border-b sm:border-b-0 sm:border-r border-gray-200 bg-gradient-to-b from-slate-50 to-white">
                             <div className="w-full">
                               <Badge variant="outline" className="mb-4 px-4 py-1 text-[9px] uppercase font-black tracking-widest border-slate-200 text-slate-400">Imagen del Dispositivo</Badge>
                             </div>
                             
                             <div className="relative w-full aspect-square max-w-[180px] mb-4">
                               <ImageGallery imageUrls={result.gateway_image_url} alt={result.gateway_ref} type="gateway" />
                             </div>
                             
                             <div className="bg-white px-5 py-1.5 rounded-xl shadow-md border border-slate-100">
                               <p className="text-xs font-black text-gray-900">{result.gateway_ref}</p>
                             </div>
                          </div>
                          
                          {/* Remote Image Gallery */}
                          <div className="p-6 flex flex-col items-center justify-between text-center bg-white sm:bg-transparent">
                             <div className="w-full">
                               <Badge variant="outline" className="mb-4 px-4 py-1 text-[9px] uppercase font-black tracking-widest border-slate-200 text-slate-400">Referencia Mando Original</Badge>
                             </div>
                             
                             <div className="relative w-full aspect-[2/3] max-w-[130px] mb-4">
                               <ImageGallery imageUrls={result.remote_image_url} alt="Remote control" type="remote" />
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
        </div>
      </section>

      <Footer />
    </main>
  )
}
