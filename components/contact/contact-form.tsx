"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, CheckCircle, Paperclip, X, Upload } from "lucide-react"
import { submitContactForm } from "@/lib/actions/contact"
import Link from "next/link"

declare global {
  interface Window {
    grecaptcha: any
  }
}

export function ContactForm({ recaptchaSiteKey = "" }: { recaptchaSiteKey?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [formError, setFormError] = useState<string>("")
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  useEffect(() => {
    // Only load reCAPTCHA if a valid site key is configured
    const isValidSiteKey = recaptchaSiteKey &&
      recaptchaSiteKey.length > 30 &&
      /^[A-Za-z0-9_-]+$/.test(recaptchaSiteKey)

    if (isValidSiteKey) {
      const script = document.createElement("script")
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
      script.async = true
      script.onload = () => setRecaptchaLoaded(true)
      script.onerror = () => setRecaptchaLoaded(false)
      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [])

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setFileError("El archivo no puede superar los 5MB")
      return false
    }
    setFileError("")
    return true
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError("")

    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file)
      } else {
        setSelectedFile(null)
        event.target.value = ""
      }
    } else {
      setSelectedFile(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        const fileInput = document.getElementById("attachment") as HTMLInputElement
        if (fileInput) {
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(file)
          fileInput.files = dataTransfer.files
        }
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFileError("")
    const fileInput = document.getElementById("attachment") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  async function handleSubmit(formData: FormData) {
    setFormError("")

    if (!acceptedPrivacy) {
      setFormError("Debes aceptar la política de privacidad para continuar")
      return
    }

    setIsSubmitting(true)

    try {
      // Execute reCAPTCHA only if it's loaded and configured properly
      const isValidSiteKey = recaptchaSiteKey && recaptchaSiteKey.length > 30 && /^[A-Za-z0-9_-]+$/.test(recaptchaSiteKey)

      if (recaptchaLoaded && window.grecaptcha && window.grecaptcha.execute && isValidSiteKey) {
        try {
          const token = await window.grecaptcha.execute(recaptchaSiteKey, {
            action: "submit",
          })
          formData.append("recaptcha_token", token)
        } catch (recaptchaError) {
          console.warn("[v0] reCAPTCHA execution failed, continuing without it:", recaptchaError)
        }
      }

      await submitContactForm(formData)
      setIsSubmitted(true)
      setSelectedFile(null)
      setFileError("")
      setAcceptedPrivacy(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormError("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
          <p className="text-gray-600 mb-4">
            Gracias por contactarnos. Nos pondremos en contacto contigo en las próximas 24 horas.
          </p>
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Enviar Otro Mensaje
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envíanos un Mensaje</CardTitle>
        <CardDescription>Completa el formulario y nos pondremos en contacto contigo lo antes posible.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" name="name" required placeholder="Tu nombre completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+34 600 000 000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" name="company" placeholder="Nombre de tu empresa" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry_type">Tipo de Consulta *</Label>
            <Select name="inquiry_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de consulta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Consulta General</SelectItem>
                <SelectItem value="quote">Solicitar Presupuesto</SelectItem>
                <SelectItem value="technical">Soporte Técnico</SelectItem>
                <SelectItem value="partnership">Colaboración</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje *</Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Cuéntanos sobre tu proyecto o consulta..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Adjuntar Archivo</Label>
            <div className="space-y-2">
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Input
                  id="attachment"
                  name="attachment"
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.zip,.rar"
                />
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium text-blue-600">Haz clic para seleccionar</span> o arrastra un archivo
                    aquí
                  </p>
                  <p className="text-xs text-gray-500">Máximo 5MB. Formatos: PDF, DOC, DOCX, JPG, PNG, TXT, ZIP, RAR</p>
                </div>
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 flex-1">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removeFile} className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {fileError && <p className="text-sm text-red-500">{fileError}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox id="privacy" checked={acceptedPrivacy} onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)} className="mt-1" />
              <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                He leído y acepto la{" "}
                <Link href="/politica-cookies" className="text-blue-600 hover:underline" target="_blank">
                  política de privacidad
                </Link>{" "}
                *
              </Label>
            </div>

            <div className="text-sm text-gray-500">
              <p>* Campos obligatorios</p>
              {recaptchaLoaded && (
                <p className="text-xs mt-1">
                  Este sitio está protegido por reCAPTCHA y se aplican la{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Política de privacidad
                  </a>{" "}
                  y los{" "}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Términos de servicio
                  </a>{" "}
                  de Google.
                </p>
              )}
            </div>
          </div>

          {formError && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{formError}</div>}

          <Button type="submit" className="w-full" disabled={isSubmitting || !acceptedPrivacy}>
            {isSubmitting ? (
              "Enviando..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensaje
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
