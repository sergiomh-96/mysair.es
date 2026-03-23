"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"
import { headers } from "next/headers"

export async function submitContactForm(formData: FormData) {
  try {
    const supabase = await createServerClient()
    console.log("[v0] Supabase client created:", supabase ? "OK" : "FAILED")

    // Get user IP address
    const headersList = await headers()
    const forwarded = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const userIp = forwarded?.split(",")[0] || realIp || "unknown"

    console.log("[v0] User IP:", userIp)

    // Check if IP is blocked
    const { data: blockedIp } = await supabase
      .from("blocked_ips")
      .select("*")
      .eq("ip_address", userIp)
      .gt("blocked_until", new Date().toISOString())
      .single()

    if (blockedIp) {
      const blockedUntil = new Date(blockedIp.blocked_until)
      const minutesLeft = Math.ceil((blockedUntil.getTime() - Date.now()) / 60000)
      throw new Error(`Tu IP está bloqueada temporalmente. Intenta de nuevo en ${minutesLeft} minutos.`)
    }

    // Check rate limit (3 attempts in the last minute)
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
    const { data: recentAttempts } = await supabase
      .from("contact_rate_limit")
      .select("*")
      .eq("ip_address", userIp)
      .gte("attempted_at", oneMinuteAgo)

    console.log("[v0] Recent attempts in last minute:", recentAttempts?.length || 0)

    if (recentAttempts && recentAttempts.length >= 3) {
      // Block IP for 1 hour
      const blockedUntil = new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      await supabase.from("blocked_ips").insert({
        ip_address: userIp,
        blocked_until: blockedUntil,
        reason: "Excedido el límite de 3 mensajes por minuto",
      })

      console.log("[v0] IP blocked for 1 hour:", userIp)
      throw new Error("Has excedido el límite de envíos. Tu IP ha sido bloqueada temporalmente por 1 hora.")
    }

    // Record this attempt
    await supabase.from("contact_rate_limit").insert({
      ip_address: userIp,
    })

    // Verify reCAPTCHA
  const recaptchaToken = formData.get("recaptcha_token") as string
  if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
    const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    })

    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      throw new Error("Verificación de reCAPTCHA fallida")
    }
  }

  const file = formData.get("attachment") as File | null
  let attachmentUrl = null
  let attachmentFilename = null
  let attachmentSize = null

  if (file && file.size > 0) {
    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const uniqueFilename = `contact-${timestamp}.${fileExtension}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("contact-attachments")
      .upload(uniqueFilename, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      throw new Error("Error al subir el archivo")
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("contact-attachments").getPublicUrl(uniqueFilename)

    attachmentUrl = publicUrl
    attachmentFilename = file.name
    attachmentSize = file.size
  }

  const inquiryType = formData.get("inquiry_type") as string

  const contactData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    company: (formData.get("company") as string) || null,
    subject: inquiryType,
    message: formData.get("message") as string,
    attachment_url: attachmentUrl,
    attachment_filename: attachmentFilename,
    attachment_size: attachmentSize,
  }

  const { error } = await supabase.from("contact_messages").insert([contactData])

  if (error) {
    console.error("Error inserting contact message:", error)
    throw new Error("Error al enviar el mensaje")
  }

  // Send email notification to mysair@mysair.es using Resend SDK
  const resendApiKey = process.env.RESEND_API_KEY?.trim()
  
  if (resendApiKey && resendApiKey.length > 10 && !resendApiKey.includes("INVALID") && !resendApiKey.includes("undefined")) {
    try {
      console.log("[v0] Attempting to send email with Resend SDK")
      
      const resend = new Resend(resendApiKey)
      
      const emailHtml = `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #0066cc;">Nuevo mensaje de contacto recibido</h2>
            <p><strong>Nombre:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Teléfono:</strong> ${contactData.phone || "No proporcionado"}</p>
            <p><strong>Empresa:</strong> ${contactData.company || "No proporcionada"}</p>
            <p><strong>Asunto:</strong> ${inquiryType}</p>
            <hr style="border: 1px solid #ddd;" />
            <h3>Mensaje:</h3>
            <p>${contactData.message.replace(/\n/g, "<br />")}</p>
            ${
              attachmentUrl
                ? `<p><strong>Archivo adjunto:</strong> <a href="${attachmentUrl}">${attachmentFilename}</a> (${(attachmentSize! / 1024 / 1024).toFixed(2)} MB)</p>`
                : ""
            }
          </body>
        </html>
      `

      const response = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "mysair@mysair.es",
        subject: `Nueva consulta: ${inquiryType} - ${contactData.name}`,
        html: emailHtml,
        reply_to: contactData.email,
      })

      if (response.error) {
        console.warn("[v0] Email API error (non-blocking):", response.error.message)
      } else {
        console.log("[v0] Email sent successfully with ID:", response.data?.id)
      }
    } catch (emailError) {
      console.warn("[v0] Error sending email notification (non-critical):", emailError instanceof Error ? emailError.message : String(emailError))
    }
  } else {
    console.log("[v0] Resend API key not configured or invalid - email notifications disabled")
  }

  revalidatePath("/contacto")
  } catch (error) {
    console.error("[v0] Error in submitContactForm:", error)
    throw error
  }
}
