import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlogHeader } from "@/components/blog/blog-header"
import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogFilters } from "@/components/blog/blog-filters"

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogHeader />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="h-96 bg-white rounded-lg animate-pulse" />}>
              <BlogFilters />
            </Suspense>
          </div>

          {/* Blog Grid */}
          <div className="lg:col-span-3">
            <Suspense
              fallback={
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-64 bg-white rounded-lg animate-pulse" />
                  ))}
                </div>
              }
            >
              <BlogGrid />
            </Suspense>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
