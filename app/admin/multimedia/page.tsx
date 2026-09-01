import { StorageManager } from "@/components/admin/storage/storage-manager"
import { FolderGit2 } from "lucide-react"

export const metadata = {
  title: "Multimedia & Storage | Panel de Administración",
}

export default function AdminMultimediaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-blue-600" />
            Multimedia & Storage
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona carpetas, sube imágenes con nombres personalizados y organiza los archivos multimedia del sitio web.
          </p>
        </div>
      </div>

      {/* Storage Explorer */}
      <StorageManager />
    </div>
  )
}
