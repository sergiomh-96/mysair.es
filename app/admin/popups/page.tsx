import { getAdminPopups } from '@/lib/actions/popup'
import { PopupManager } from '@/components/admin/popups/popup-manager'

export const dynamic = 'force-dynamic'

export default async function AdminPopupsPage() {
  const popups = await getAdminPopups()

  return <PopupManager initialPopups={popups} />
}
