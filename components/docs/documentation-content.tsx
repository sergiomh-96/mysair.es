"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, EuroIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

interface DocumentationContentProps {
  links: any[]
}

export function DocumentationContent({ links }: DocumentationContentProps) {
  const { t } = useI18n()

  const getIcon = (type: string) => {
    switch (type) {
      case "catalog":
        return <FileText className="h-8 w-8 text-primary" />
      case "tariff":
        return <EuroIcon className="h-8 w-8 text-primary" />
      default:
        return <FileText className="h-8 w-8 text-primary" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t("docs.title")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("docs.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {links.map((link) => (
            <Card key={link.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">{getIcon(link.type)}</div>
                <CardTitle className="text-2xl font-bold text-card-foreground">{link.name}</CardTitle>
                <CardDescription className="text-muted-foreground text-base">{link.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    {t("docs.view_document")}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {links.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t("docs.no_docs")}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
