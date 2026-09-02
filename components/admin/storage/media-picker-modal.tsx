"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StorageManager } from "./storage-manager"
import { FolderOpen, Image as ImageIcon } from "lucide-react"

interface MediaPickerModalProps {
  onSelect: (url: string) => void
  triggerLabel?: string
  triggerVariant?: "default" | "outline" | "secondary" | "ghost"
  className?: string
  initialPath?: string
}

export function MediaPickerModal({
  onSelect,
  triggerLabel = "Examinar Storage",
  triggerVariant = "outline",
  className = "",
  initialPath = "",
}: MediaPickerModalProps) {
  const [open, setOpen] = useState(false)

  function handleFileSelect(url: string) {
    onSelect(url)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          size="sm"
          className={`gap-1.5 text-xs font-semibold h-8 bg-white border-slate-300 hover:bg-slate-50 text-slate-700 ${className}`}
        >
          <FolderOpen className="h-3.5 w-3.5 text-amber-500" />
          <span>{triggerLabel}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[96vw] max-w-[1400px] sm:max-w-[1400px] h-[92vh] max-h-[92vh] flex flex-col p-5 sm:p-6 overflow-hidden">
        <DialogHeader className="pb-3 border-b border-slate-100 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-slate-900 text-base sm:text-lg font-bold">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <span>Seleccionar o Subir Imagen desde Storage</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pt-3 pr-1">
          <StorageManager
            pickerMode={true}
            initialPath={initialPath}
            onSelectFile={handleFileSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
