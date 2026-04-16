"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, FileText, Newspaper, Award } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  author: string
  image_url: string
  category: string
  tags: string[]
  route_type?: string
  published_at?: string
  created_at: string
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const { t, locale } = useI18n()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return FileText
      case "news":
        return Newspaper
      case "case_study":
        return Award
      default:
        return FileText
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "technical":
        return "Técnico"
      case "news":
        return "Noticias"
      case "case_study":
        return "Caso de Éxito"
      default:
        return category
    }
  }

  const formatDate = (dateString: string) => {
    const localeMap: Record<string, string> = {
      es: "es-ES",
      en: "en-GB",
      fr: "fr-FR",
      it: "it-IT",
    }
    return new Date(dateString).toLocaleDateString(localeMap[locale] || "es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const CategoryIcon = getCategoryIcon(post.category)
  const postHref = `/${post.route_type ?? "blogs"}/${post.slug}`

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/3">
          <div className="aspect-video md:aspect-square bg-gray-100 overflow-hidden">
            <img
              src={post.image_url || "/placeholder.svg?height=300&width=400"}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Content */}
        <CardContent className="md:w-2/3 p-6">
          <div className="flex items-center gap-2 mb-3">
            <CategoryIcon className="h-4 w-4 text-blue-600" />
            <Badge variant="secondary" className="text-xs">
              {getCategoryName(post.category)}
            </Badge>
          </div>

          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 text-balance">
            <Link href={postHref} className="hover:text-blue-600 transition-colors">
              {post.title}
            </Link>
          </h2>

          <p className="text-gray-600 mb-4 text-pretty line-clamp-3">{post.excerpt}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{post.tags.length - 3} {t("products.detail.see_more").toLowerCase()}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at ?? post.created_at)}</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" asChild>
              <Link href={postHref}>
                {t("blog.grid.read_more")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
