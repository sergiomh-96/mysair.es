"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface Room {
  id: string
  nombre: string
  superficie: string
  altura: string
  cargaTermica: string
  velocidadTerminal: string
  difusorSeleccionado: string
}

interface PDFReportGeneratorProps {
  referencia: string
  provincia: string
  tipoVivienda: string
  tipoAislamiento: string
  cliente: string
  fecha: Date
  rooms: Room[]
  marcaMaquina: string
  modeloMaquina: string
  potenciaEquipo: string
  caudalMaquina: string
  cargaTermicaTotal: number
}

export function PDFReportGenerator(props: PDFReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const calcularCaudalEstancia = (room: Room): number => {
    if (!props.caudalMaquina || !room.superficie || !room.cargaTermica) return 0

    const cargaTermicaEstancia = Number.parseFloat(room.superficie) * Number.parseFloat(room.cargaTermica)

    if (props.cargaTermicaTotal === 0) return 0

    const porcentaje = cargaTermicaEstancia / props.cargaTermicaTotal
    return porcentaje * Number.parseFloat(props.caudalMaquina)
  }

  const calcularAreaEfectiva = (room: Room): number => {
    const caudal = calcularCaudalEstancia(room)
    const velocidad = Number.parseFloat(room.velocidadTerminal) || 3.0
    return caudal / (3600 * velocidad)
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      const doc = new jsPDF("portrait", "mm", "a4")
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // ============ PÁGINA 1: PORTADA (profesional sin dibujos) ============

      // Fondo blanco total
      doc.setFillColor(255, 255, 255)
      doc.rect(0, 0, pageWidth, pageHeight, "F")

      // Encabezado blanco con línea decorativa azul
      doc.setDrawColor(0, 158, 224)
      doc.setLineWidth(1.5)
      doc.line(0, 58, pageWidth, 58)

      // Franja azul marino encima del footer
      doc.setFillColor(18, 52, 86)
      doc.rect(0, pageHeight - 40, pageWidth, 40, "F")

      // Logo MYSAir real (imagen embebida via URL)
      try {
        const logoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mysair-logo-v03-OK-transparent-CP2erDXtxB9Az9giXefr8RCV5YJ3Jo.png"
        const img = new Image()
        img.crossOrigin = "anonymous"
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject()
          img.src = logoUrl
        })
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL("image/png")
        // Logo centrado en la franja azul
        const logoW = 80
        const logoH = (img.height / img.width) * logoW
        doc.addImage(dataUrl, "PNG", (pageWidth - logoW) / 2, (60 - logoH) / 2, logoW, logoH)
      } catch {
        // Fallback texto si no carga la imagen
        doc.setTextColor(18, 52, 86)
        doc.setFontSize(26)
        doc.setFont(undefined, "bold")
        doc.text("MYSair", pageWidth / 2, 35, { align: "center" })
        doc.setFontSize(10)
        doc.setFont(undefined, "normal")
        doc.text("sistema de zonas y difusión", pageWidth / 2, 47, { align: "center" })
      }

      // Título del documento
      doc.setTextColor(18, 52, 86)
      doc.setFontSize(28)
      doc.setFont(undefined, "bold")
      doc.text("INFORME DE PROYECTO", pageWidth / 2, 100, { align: "center" })

      // Subtítulo
      doc.setFontSize(13)
      doc.setFont(undefined, "normal")
      doc.setTextColor(0, 158, 224)
      doc.text("SISTEMA DE ZONAS Y DIFUSIÓN", pageWidth / 2, 112, { align: "center" })

      // Línea divisoria
      doc.setDrawColor(0, 158, 224)
      doc.setLineWidth(0.8)
      doc.line(20, 120, pageWidth - 20, 120)

      // Datos del proyecto
      const campos = [
        { label: "Cliente", value: props.cliente || "Sin especificar" },
        { label: "Referencia", value: props.referencia || "Sin especificar" },
        { label: "Provincia", value: props.provincia || "Sin especificar" },
        { label: "Tipo de Vivienda", value: props.tipoVivienda || "Sin especificar" },
        { label: "Aislamiento", value: props.tipoAislamiento || "Sin especificar" },
        { label: "Fecha", value: props.fecha.toLocaleDateString("es-ES") },
      ]

      let dataY = 140
      campos.forEach((campo) => {
        // Fondo alterno
        doc.setFillColor(247, 250, 252)
        doc.rect(20, dataY - 5, pageWidth - 40, 14, "F")

        doc.setFontSize(10)
        doc.setFont(undefined, "bold")
        doc.setTextColor(100, 100, 100)
        doc.text(campo.label + ":", 25, dataY + 4)

        doc.setFont(undefined, "normal")
        doc.setTextColor(18, 52, 86)
        doc.text(campo.value, 80, dataY + 4)

        dataY += 16
      })

      // Línea divisoria inferior
      doc.setDrawColor(0, 158, 224)
      doc.setLineWidth(0.8)
      doc.line(20, dataY + 5, pageWidth - 20, dataY + 5)

      // Texto footer franja oscura
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont(undefined, "normal")
      doc.text("www.mysair.es", pageWidth / 2, pageHeight - 24, { align: "center" })
      doc.setFontSize(8)
      doc.setTextColor(180, 210, 230)
      doc.text("Documento generado automáticamente por MYSsolver", pageWidth / 2, pageHeight - 14, { align: "center" })

      // ============ PÁGINA 2: DETALLES DE ESTANCIAS ============
      
      doc.addPage("a4", "portrait")

      // Header con barra azul
      doc.setFillColor(0, 158, 224)
      doc.rect(0, 0, pageWidth, 25, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont(undefined, "bold")
      doc.text("Desglose de Estancias", 20, 16)

      // Tabla mejorada con mejor diseño
      const tableData = props.rooms.map((room) => [
        room.nombre || "Sin nombre",
        room.superficie || "0",
        room.altura || "0",
        room.cargaTermica || "0",
        room.superficie && room.cargaTermica
          ? (Number.parseFloat(room.superficie) * Number.parseFloat(room.cargaTermica)).toFixed(0)
          : "0",
        calcularCaudalEstancia(room).toFixed(1),
        room.difusorSeleccionado || "Sin seleccionar",
      ])

      autoTable(doc, {
        startY: 35,
        head: [["Estancia", "Sup.\n(m²)", "Alt.\n(m)", "CT\n(W/m²)", "CT\nTotal (W)", "Caudal\n(m³/h)", "Difusor\nSeleccionado"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [0, 158, 224],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
          cellPadding: { top: 3, bottom: 3, left: 2, right: 2 },
          lineWidth: 0.1,
          lineColor: [255, 255, 255],
          minCellHeight: 10,
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
          textColor: [60, 60, 60],
          lineWidth: 0.1,
          lineColor: [220, 220, 220],
          minCellHeight: 7,
        },
        alternateRowStyles: {
          fillColor: [245, 248, 250],
        },
        columnStyles: {
          0: { cellWidth: 42, fontStyle: "bold", textColor: [0, 158, 224] },
          1: { cellWidth: 18, halign: "center" },
          2: { cellWidth: 16, halign: "center" },
          3: { cellWidth: 20, halign: "center" },
          4: { cellWidth: 22, halign: "center", fontStyle: "bold", textColor: [220, 38, 38] },
          5: { cellWidth: 20, halign: "center", fontStyle: "bold", textColor: [0, 158, 224] },
          6: { cellWidth: "auto", fontSize: 7 },
        },
        tableWidth: pageWidth - 20,
        margin: { left: 10, right: 10 },
      })

      const finalY = (doc as any).lastAutoTable.finalY + 20

      // Verificar espacio disponible
      let yPos: number
      if (finalY > pageHeight - 120) {
        doc.addPage("a4", "portrait")
        yPos = 30
      } else {
        yPos = finalY
      }

      // Tarjeta de resumen con diseño corporativo
      doc.setFillColor(240, 248, 252) // Azul muy claro
      doc.roundedRect(15, yPos, pageWidth - 30, 45, 3, 3, "F")
      
      // Borde izquierdo azul
      doc.setFillColor(0, 158, 224)
      doc.rect(15, yPos, 4, 45, "F")

      doc.setFontSize(12)
      doc.setTextColor(0, 158, 224)
      doc.setFont(undefined, "bold")
      doc.text("Resumen General", 25, yPos + 10)

      doc.setFontSize(10)
      doc.setFont(undefined, "normal")
      doc.setTextColor(60, 60, 60)
      
      const superficieTotal = props.rooms.reduce((total, room) => total + (Number.parseFloat(room.superficie) || 0), 0)
      
      doc.setFont(undefined, "bold")
      doc.text("Total de Estancias:", 25, yPos + 22)
      doc.setFont(undefined, "normal")
      doc.text(`${props.rooms.length}`, 70, yPos + 22)

      doc.setFont(undefined, "bold")
      doc.text("Superficie Total:", 25, yPos + 32)
      doc.setFont(undefined, "normal")
      doc.text(`${superficieTotal.toFixed(2)} m²`, 70, yPos + 32)

      doc.setFont(undefined, "bold")
      doc.text("Carga Térmica Total:", 110, yPos + 22)
      doc.setFont(undefined, "normal")
      doc.setTextColor(220, 38, 38)
      doc.text(`${props.cargaTermicaTotal.toFixed(0)} W`, 160, yPos + 22)

      doc.setFont(undefined, "bold")
      doc.setTextColor(60, 60, 60)
      doc.text("Potencia:", 110, yPos + 32)
      doc.setFont(undefined, "normal")
      doc.text(`${(props.cargaTermicaTotal / 1000).toFixed(2)} kW`, 160, yPos + 32)

      yPos += 60

      // Sección de equipo con diseño corporativo
      doc.setFillColor(0, 158, 224)
      doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont(undefined, "bold")
      doc.text("Equipo Seleccionado", 20, yPos + 7)

      yPos += 16

      // Tarjeta de equipo compacta
      const equipmentInfo = [
        { label: "Marca", value: props.marcaMaquina || "Sin especificar" },
        { label: "Modelo", value: props.modeloMaquina || "Sin especificar" },
        { label: "Potencia", value: props.potenciaEquipo ? `${props.potenciaEquipo} kW` : "Sin especificar" },
        { label: "Caudal Total", value: props.caudalMaquina ? `${props.caudalMaquina} m³/h` : "Sin especificar" },
      ]

      const equipCardH = 10 + equipmentInfo.length * 8
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(15, yPos, pageWidth - 30, equipCardH, 2, 2, "F")
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.4)
      doc.roundedRect(15, yPos, pageWidth - 30, equipCardH, 2, 2, "S")

      doc.setFontSize(9)
      let equipY = yPos + 7

      equipmentInfo.forEach((item) => {
        doc.setFont(undefined, "bold")
        doc.setTextColor(100, 100, 100)
        doc.text(`${item.label}:`, 22, equipY)
        doc.setFont(undefined, "normal")
        doc.setTextColor(0, 158, 224)
        doc.text(item.value, 65, equipY)
        equipY += 8
      })

      yPos += equipCardH + 10

      // Disclaimer/Responsabilidad antes del footer
      const disclaimerY = pageHeight - 50
      doc.setFillColor(247, 250, 252)
      doc.rect(15, disclaimerY - 28, pageWidth - 30, 25, "F")
      
      doc.setFontSize(7)
      doc.setFont(undefined, "normal")
      doc.setTextColor(80, 80, 80)
      
      const disclaimerText = "MYSair no se responsabiliza de los cálculos, resultados, dimensionamientos ni diseños generados mediante el presente programa cuando estos hayan sido configurados, modificados o introducidos por el usuario. El usuario asume íntegramente la responsabilidad sobre la veracidad de los datos introducidos, la correcta aplicación de los criterios técnicos y normativos, y el uso que se haga de los resultados obtenidos."
      
      doc.text(disclaimerText, 18, disclaimerY - 25, {
        maxWidth: pageWidth - 36,
        align: "justify",
      })

      // Footer de página
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(8)
      doc.text(
        `Página 2 | ${props.referencia || "Informe"} | ${props.fecha.toLocaleDateString("es-ES")}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      )
      doc.text("www.mysair.es", pageWidth - 20, pageHeight - 10, { align: "right" })

      // Guardar PDF
      const fileName = `Informe_${props.referencia || "Instalacion"}_${props.fecha.toISOString().split("T")[0]}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleGeneratePDF} disabled={isGenerating} size="lg" className="bg-blue-600 hover:bg-blue-700">
      <FileText className="h-5 w-5 mr-2" />
      {isGenerating ? "Generando PDF..." : "Generar Informe PDF"}
    </Button>
  )
}
