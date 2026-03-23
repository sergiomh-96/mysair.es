"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Paperclip, Search, Mail, Phone, Building2, MessageSquare } from "lucide-react"

type Message = {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string | null
  message: string
  status: string | null
  attachment_url: string | null
  attachment_filename: string | null
  attachment_size: number | null
  created_at: string
}

export function AdminMessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const [selected, setSelected] = useState<Message | null>(null)
  const [search, setSearch] = useState("")

  const filtered = initialMessages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.subject ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mensajes de contacto</h1>
          <p className="text-slate-500 text-sm mt-1">{initialMessages.length} mensajes recibidos</p>
        </div>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nombre, email o asunto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Remitente</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Adjunto</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-slate-400 py-10">No hay mensajes</TableCell></TableRow>
            )}
            {filtered.map((msg) => (
              <TableRow
                key={msg.id}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => setSelected(msg)}
              >
                <TableCell>
                  <p className="font-medium text-slate-900">{msg.name}</p>
                  <p className="text-xs text-slate-400">{msg.email}</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-700">{msg.subject ?? "—"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-500">{msg.company ?? "—"}</span>
                </TableCell>
                <TableCell>
                  {msg.attachment_url
                    ? <Paperclip className="h-4 w-4 text-blue-500" />
                    : <span className="text-slate-300">—</span>}
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {new Date(msg.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Mensaje de {selected?.name}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    {selected.phone}
                  </div>
                )}
                {selected.company && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                    {selected.company}
                  </div>
                )}
              </div>

              {selected.subject && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Asunto</p>
                  <Badge variant="outline">{selected.subject}</Badge>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Mensaje</p>
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100">
                  {selected.message}
                </div>
              </div>

              {selected.attachment_url && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Adjunto</p>
                  <a
                    href={selected.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Paperclip className="h-4 w-4" />
                    {selected.attachment_filename ?? "Descargar archivo"}
                    {selected.attachment_size && (
                      <span className="text-slate-400">({(selected.attachment_size / 1024 / 1024).toFixed(2)} MB)</span>
                    )}
                  </a>
                </div>
              )}

              <p className="text-xs text-slate-400">
                Recibido el {new Date(selected.created_at).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
