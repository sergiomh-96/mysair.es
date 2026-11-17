interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>
}

/**
 * Renders a JSON-LD structured data script tag safely in server-rendered HTML.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c")

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}

