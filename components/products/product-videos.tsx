"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, ExternalLink } from "lucide-react"

interface ProductVideo {
  id: number
  title: string
  youtube_url: string
  description?: string
  sort_order: number
}

interface ProductVideosProps {
  videos: ProductVideo[]
}

export function ProductVideos({ videos }: ProductVideosProps) {
  if (!videos || videos.length === 0) {
    return null
  }

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-red-600" />
            Videos de instalación y usuario  
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const thumbnailUrl = getYouTubeThumbnail(video.youtube_url)

              return (
                <div key={video.id} className="group">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {thumbnailUrl && (
                      <img
                        src={thumbnailUrl || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {video.title}
                    </h3>

                    {video.description && <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>}

                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <a
                        href={video.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ver en YouTube
                      </a>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
