import { normalizeProductImages } from "@/lib/utils/product-image"

export const SITE_URL = "https://www.mysair.es"
export const SITE_NAME = "MYSAir"
export const LOGO_URL = `${SITE_URL}/logo-mysair.png`

export function toAbsoluteUrl(urlOrPath?: unknown): string | undefined {
  if (typeof urlOrPath !== "string") return undefined
  const trimmed = urlOrPath.trim()
  if (!trimmed) return undefined
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `${SITE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
    email: "mysair@mysair.es",
    telephone: "+34966744473",
    address: {
      "@type": "PostalAddress",
      streetAddress: "C/Mayor, 27",
      postalCode: "30149",
      addressLocality: "El Siscar",
      addressRegion: "Murcia",
      addressCountry: "ES",
    },
    location: {
      "@type": "Place",
      name: "Fábrica MYSAir",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Carretera Nacional N-340",
        postalCode: "03311",
        addressLocality: "La Aparecida",
        addressRegion: "Alicante",
        addressCountry: "ES",
      },
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+34966744473",
      email: "mysair@mysair.es",
      contactType: "customer service",
      areaServed: "ES",
      availableLanguage: ["Spanish", "English", "French", "Italian"],
    },
    sameAs: [
      "https://www.linkedin.com/company/mysair",
      "https://www.facebook.com/MYSAIR?locale=es_ES",
      "https://www.instagram.com/_mysair_/",
      "https://www.youtube.com/@mysair/featured",
    ],
  }
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.url) ?? item.url,
    })),
  }
}

export interface FaqItem {
  question: string
  answer: string
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export interface ArticleSchemaInput {
  title: string
  meta_title?: string | null
  excerpt?: string | null
  meta_description?: string | null
  image_url?: string | null
  og_image?: string | null
  author?: string | null
  published_at?: string | null
  created_at?: string | null
  updated_at?: string | null
  canonical_url?: string | null
}

export function buildArticleSchema(post: ArticleSchemaInput, pageUrl: string) {
  const headline = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || undefined
  const image = toAbsoluteUrl(post.og_image || post.image_url)
  const datePublished = post.published_at || post.created_at || undefined
  const dateModified = post.updated_at || datePublished
  const canonical = toAbsoluteUrl(post.canonical_url) || toAbsoluteUrl(pageUrl) || pageUrl

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    author: {
      "@type": post.author && post.author.toLowerCase() !== "mysair" ? "Person" : "Organization",
      name: post.author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  }
}

export interface ProductSchemaInput {
  name: string
  slug: string
  description?: string | null
  image_url?: unknown
  images?: unknown
  category?: string | null
  sku?: string | null
}

export function buildProductSchema(product: ProductSchemaInput, pageUrl: string) {
  const normalizedImages = [
    ...normalizeProductImages(product.images),
    ...normalizeProductImages(product.image_url),
  ]
  const images = Array.from(
    new Set(
      normalizedImages
        .map((img) => toAbsoluteUrl(img.url))
        .filter((img): img is string => Boolean(img))
    )
  )

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    sku: product.sku || product.slug,
    ...(product.category ? { category: product.category } : {}),
    url: toAbsoluteUrl(pageUrl) || pageUrl,
  }
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

export function extractFaqsFromSections(
  sections?: Array<{ content?: string | null }> | null
): FaqItem[] {
  if (!Array.isArray(sections)) return []

  const faqs: FaqItem[] = []
  const faqRegex = /<FAQItem\s+question=["']([^"']+)["']>([\s\S]*?)<\/FAQItem>/gi

  for (const section of sections) {
    const content = section?.content
    if (!content) continue

    let match: RegExpExecArray | null
    faqRegex.lastIndex = 0
    while ((match = faqRegex.exec(content)) !== null) {
      const question = match[1]?.trim()
      const answer = stripHtmlTags(match[2] || "")
      if (question && answer) {
        faqs.push({ question, answer })
      }
    }
  }

  return faqs
}

