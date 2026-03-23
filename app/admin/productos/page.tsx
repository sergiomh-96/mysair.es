import { getProducts } from "@/lib/actions/admin-products"
import { AdminProductsClient } from "@/components/admin/admin-products-client"

export default async function AdminProductsPage() {
  const products = await getProducts()
  return <AdminProductsClient initialProducts={products} />
}
