import Link from "next/link"

interface SolicitarPresupuestoBtnProps {
  productSlug?: string
}

export function SolicitarPresupuestoBtn({ productSlug }: SolicitarPresupuestoBtnProps) {
  const url = productSlug ? `/contacto?interes=${productSlug}` : "/contacto"

  return (
    <div className="w-full my-4">
      <Link href={url} className="block w-full">
        <span className="block w-full bg-black/50 hover:bg-black/70 text-white font-bold py-3.5 px-5 rounded-lg text-center shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 text-base uppercase tracking-wider cursor-pointer select-none">
          Solicitar Presupuesto Ahora
        </span>
      </Link>
    </div>
  )
}
