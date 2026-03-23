"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Share2, Clock, BookOpen } from "lucide-react"
import Link from "next/link"

interface Section {
  id: string
  type?: "h2" | "h3"
  level?: "h2" | "h3"
  title: string
  content: string
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  sections: Section[] | null
  summary: string | null
  author: string
  image_url: string | null
  category: string | null
  tags: string[]
  reading_time: number | null
  route_type?: string
  published_at: string | null
  created_at: string
}

interface BlogPostDetailProps {
  post: BlogPost
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  const sections: Section[] = post.sections ?? []

  // Normalize: accept both "type" and "level" field
  const normalizedSections = sections.map((s) => ({
    ...s,
    level: (s.level ?? s.type ?? "h2") as "h2" | "h3",
  }))

  const h2Sections = normalizedSections.filter((s) => s.level === "h2")
  const displayDate = post.published_at ?? post.created_at
  const backHref = post.route_type === "blog" ? "/blog" : "/blogs"

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Blog
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.share?.({ title: post.title, url: window.location.href })
                  .catch(() => navigator.clipboard?.writeText(window.location.href))
              }
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href={backHref} className="hover:text-blue-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* ── MAIN COLUMN ── */}
          <main>
            {/* Category badge */}
            {post.category && (
              <div className="mb-4">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                  {post.category}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight text-balance">
              {post.title}
            </h1>

            {/* Excerpt / Intro */}
            {post.excerpt && (
              <p className="text-lg text-gray-500 mb-6 leading-relaxed text-pretty border-l-4 border-blue-500 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(displayDate)}</span>
              </div>
              {post.reading_time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time} min de lectura</span>
                </div>
              )}
            </div>

            {/* Featured image */}
            {post.image_url && (
              <div className="aspect-video rounded-xl overflow-hidden mb-10 bg-gray-100 shadow-sm">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Intro content (HTML) */}
            {post.content && (
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-10"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Sections */}
            {normalizedSections.length > 0 && (
              <div className="space-y-8 mb-12">
                {normalizedSections.map((section) => (
                  <section key={section.id}>
                    {section.level === "h2" ? (
                      <h2
                        id={slugify(section.title)}
                        className="text-2xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-20 pb-2 border-b border-gray-100"
                      >
                        {section.title}
                      </h2>
                    ) : (
                      <h3
                        id={slugify(section.title)}
                        className="text-xl font-semibold text-gray-800 mt-8 mb-3 scroll-mt-20 pl-4 border-l-4 border-blue-400"
                      >
                        {section.title}
                      </h3>
                    )}
                    {section.content && (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line prose prose-base max-w-none">
                        {section.content}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}

            {/* Summary */}
            {post.summary && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Resumen</h3>
                </div>
                <p className="text-blue-800 leading-relaxed text-sm">{post.summary}</p>
              </div>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="border-t border-gray-100 pt-6 mb-10">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Etiquetas</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#1a3a5c] to-[#009ee0] rounded-xl p-8 text-center text-white">
              <h3 className="text-xl font-bold mb-2">¿Necesitas asesoramiento técnico?</h3>
              <p className="text-blue-100 mb-5 text-sm">
                Nuestro equipo de expertos está aquí para ayudarte con tu proyecto de climatización.
              </p>
              <Button asChild variant="secondary">
                <Link href="/contacto">Contactar con Expertos</Link>
              </Button>
            </div>
          </main>

          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Table of contents */}
              {h2Sections.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Índice de contenidos
                  </p>
                  <ol className="space-y-2">
                    {h2Sections.map((section, index) => (
                      <li key={section.id} className="flex items-start gap-2">
                        <span className="text-blue-500 font-semibold text-xs mt-1 shrink-0 w-4">
                          {index + 1}.
                        </span>
                        <a
                          href={`#${slugify(section.title)}`}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors leading-snug"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Article info card */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3 text-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Información del artículo
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{formatDate(displayDate)}</span>
                </div>
                {post.reading_time && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>{post.reading_time} min de lectura</span>
                  </div>
                )}
                {post.category && (
                  <div className="pt-2">
                    <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">
                      {post.category}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile: table of contents before content */}
        {h2Sections.length > 0 && (
          <div className="lg:hidden mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100 order-first">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Índice de contenidos
            </p>
            <ol className="space-y-2">
              {h2Sections.map((section, index) => (
                <li key={section.id} className="flex items-start gap-2">
                  <span className="text-blue-500 font-semibold text-xs mt-0.5 shrink-0">{index + 1}.</span>
                  <a
                    href={`#${slugify(section.title)}`}
                    className="text-sm text-blue-600 hover:underline leading-snug"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
