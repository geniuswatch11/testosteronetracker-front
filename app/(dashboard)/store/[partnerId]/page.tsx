"use client"

import { useParams } from "next/navigation"
import { ExternalLinkModal } from "@/components/store/external-link-modal"

// Mapeo de IDs de partners a URLs externas
const partnerUrls: Record<string, string> = {
  vitamins: "https://www.google.com",
  whoop: "https://www.google.com",
  "labs-sorio": "https://www.google.com",
  muse: "https://www.google.com",
}

export default function PartnerDetailPage() {
  const params = useParams()
  const partnerId = params.partnerId as string

  // Obtener la URL del partner o usar Google como fallback
  const externalUrl = partnerUrls[partnerId] || "https://www.google.com"

  return <ExternalLinkModal externalUrl={externalUrl} />
}
