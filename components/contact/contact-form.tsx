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
import { useI18n } from "@/lib/i18n-context"

declare global {
  interface Window {
    grecaptcha: any
  }
}

export function ContactForm({ recaptchaSiteKey = "" }: { recaptchaSiteKey?: string }) {
  const { t } = useI18n()
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
    const isValidSiteKey =
      recaptchaSiteKey && recaptchaSiteKey.length > 30 && /^[A-Za-z0-9_-]+$/.test(recaptchaSiteKey)

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
  }, [recaptchaSiteKey])

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setFileError(t("contact.form.error_file_size"))
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
      setFormError(t("contact.form.error_privacy"))
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
      setFormError(t("contact.form.error_generic"))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("contact.form.success_title")}</h3>
          <p className="text-gray-600 mb-4">{t("contact.form.success_desc")}</p>
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            {t("contact.form.send_another")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("contact.form.title")}</CardTitle>
        <CardDescription>{t("contact.form.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("contact.form.name")}</Label>
              <Input id="name" name="name" required placeholder={t("contact.form.name_placeholder")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("contact.form.email")}</Label>
              <Input id="email" name="email" type="email" required placeholder={t("contact.form.email_placeholder")} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("contact.form.phone")}</Label>
              <Input id="phone" name="phone" type="tel" placeholder={t("contact.form.phone_placeholder")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">{t("contact.form.company")}</Label>
              <Input id="company" name="company" placeholder={t("contact.form.company_placeholder")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry_type">{t("contact.form.inquiry_type")}</Label>
            <Select name="inquiry_type" required>
              <SelectTrigger>
                <SelectValue placeholder={t("contact.form.inquiry_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t("contact.form.inquiry_general")}</SelectItem>
                <SelectItem value="quote">{t("contact.form.inquiry_quote")}</SelectItem>
                <SelectItem value="technical">{t("contact.form.inquiry_technical")}</SelectItem>
                <SelectItem value="partnership">{t("contact.form.inquiry_partnership")}</SelectItem>
                <SelectItem value="other">{t("contact.form.inquiry_other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t("contact.form.message")}</Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder={t("contact.form.message_placeholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">{t("contact.form.attachment")}</Label>
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
                    <span className="font-medium text-blue-600">{t("contact.form.attachment_click")}</span>{" "}
                    {t("contact.form.attachment_drag")}
                  </p>
                  <p className="text-xs text-gray-500">{t("contact.form.attachment_hint")}</p>
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
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                {t("contact.form.privacy_accept")}{" "}
                <Link href="/politica-cookies" className="text-blue-600 hover:underline" target="_blank">
                  {t("contact.form.privacy_link")}
                </Link>{" "}
                *
              </Label>
            </div>

            <div className="text-sm text-gray-500">
              <p>* {t("contact.form.required_fields")}</p>
              {recaptchaLoaded && <p className="text-xs mt-1">{t("contact.form.recaptcha_notice")}</p>}
            </div>
          </div>

          {formError && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{formError}</div>}

          <Button type="submit" className="w-full" disabled={isSubmitting || !acceptedPrivacy}>
            {isSubmitting ? (
              t("contact.form.sending")
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t("contact.form.send")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
