"use client"

import { useState, useRef, useTransition } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSpreadsheet, Download, Upload, CheckCircle2, AlertCircle, RefreshCw, FileText } from "lucide-react"
import { toast } from "sonner"

interface BulkExcelImportProps {
  title: string
  description: string
  templateFilename: string
  templateHeaders: string[]
  templateSampleData: Record<string, string | number | boolean>[]
  onImport: (rows: Record<string, unknown>[]) => Promise<{ count: number }>
  triggerLabel?: string
}

export function BulkExcelImport({
  title,
  description,
  templateFilename,
  templateHeaders,
  templateSampleData,
  onImport,
  triggerLabel = "Importar Excel / CSV",
}: BulkExcelImportProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<Record<string, unknown>[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function downloadTemplate() {
    try {
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(templateSampleData, { header: templateHeaders })
      XLSX.utils.book_append_sheet(wb, ws, "Plantilla")
      XLSX.writeFile(wb, `${templateFilename}.xlsx`)
      toast.success("Plantilla Excel descargada correctamente")
    } catch {
      toast.error("Error al generar la plantilla Excel")
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    processFile(selectedFile)
  }

  function processFile(fileToProcess: File) {
    setError(null)
    setFile(fileToProcess)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" })

        if (json.length === 0) {
          setError("El archivo está vacío o no contiene datos válidos.")
          setParsedRows([])
          setColumns([])
          return
        }

        const detectedCols = Object.keys(json[0])
        setColumns(detectedCols)
        setParsedRows(json)
        toast.info(`${json.length} filas detectadas en el archivo.`)
      } catch (err) {
        setError("Error al leer el archivo Excel/CSV. Verifica que el formato sea válido.")
        setParsedRows([])
        setColumns([])
      }
    }
    reader.readAsArrayBuffer(fileToProcess)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  function resetState() {
    setFile(null)
    setParsedRows([])
    setColumns([])
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleConfirmImport() {
    if (parsedRows.length === 0) return
    startTransition(async () => {
      try {
        const result = await onImport(parsedRows)
        toast.success(`¡Éxito! Se han importado ${result.count} registros correctamente.`)
        setOpen(false)
        resetState()
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al realizar la importación masiva"
        setError(msg)
        toast.error(msg)
      }
    })
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2 border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-2xs font-medium"
      >
        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
        <span>{triggerLabel}</span>
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetState(); }}>
        <DialogContent className="max-w-5xl sm:max-w-5xl md:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">{title}</DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 my-2">
            {/* Step 1: Download Template */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold font-mono">
                    1
                  </span>
                  <p className="text-sm font-semibold text-slate-800">Descarga la plantilla de ejemplo</p>
                </div>
                <p className="text-xs text-slate-500 pl-7">
                  Contiene todas las columnas requeridas y filas con datos de ejemplo para que solo tengas que rellenarla.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="gap-2 bg-white text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold shrink-0"
              >
                <Download className="h-4 w-4" />
                Descargar Plantilla (.xlsx)
              </Button>
            </div>

            {/* Step 2: Upload File Area */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold font-mono">
                  2
                </span>
                <p className="text-sm font-semibold text-slate-800">Sube tu archivo completado</p>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  file
                    ? "border-emerald-400 bg-emerald-50/30"
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100/70"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-3 rounded-full ${file ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-600"}`}>
                    {file ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                  </div>
                  {file ? (
                    <div>
                      <p className="text-sm font-bold text-slate-900">{file.name}</p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        Archivo listo para procesar ({(file.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Arrastra aquí tu archivo Excel o haz clic para seleccionarlo
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Soporta formatos .xlsx, .xls y .csv</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 3: Data Preview */}
            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold font-mono">
                      3
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      Vista previa de datos ({parsedRows.length} filas detectadas)
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Mostrando las primeras 5 filas
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-60 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 text-xs">
                        <TableHead className="w-12 text-center">#</TableHead>
                        {columns.slice(0, 8).map((col) => (
                          <TableHead key={col} className="font-semibold text-slate-700 whitespace-nowrap">
                            {col}
                          </TableHead>
                        ))}
                        {columns.length > 8 && (
                          <TableHead className="font-semibold text-slate-400">
                            +{columns.length - 8} columnas más...
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedRows.slice(0, 5).map((row, idx) => (
                        <TableRow key={idx} className="text-xs">
                          <TableCell className="text-center font-mono text-slate-400">{idx + 1}</TableCell>
                          {columns.slice(0, 8).map((col) => (
                            <TableCell key={col} className="max-w-[180px] truncate text-slate-700 font-mono">
                              {String(row[col] ?? "")}
                            </TableCell>
                          ))}
                          {columns.length > 8 && (
                            <TableCell className="text-slate-400 text-xs">...</TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setOpen(false); resetState(); }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmImport}
              disabled={parsedRows.length === 0 || isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Importando registros...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Importar {parsedRows.length} registros
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
