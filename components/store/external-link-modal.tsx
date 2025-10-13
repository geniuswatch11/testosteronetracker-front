"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"

interface ExternalLinkModalProps {
  externalUrl: string
}

export function ExternalLinkModal({ externalUrl }: ExternalLinkModalProps) {
  const router = useRouter()
  const { t } = useLanguage()

  const handleBack = () => {
    router.back()
  }

  const handleContinue = () => {
    window.location.href = externalUrl
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-white text-xl font-medium">
            {t("store.externalLinkTitle")}
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            {t("store.externalLinkMessage")}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleBack}
            className="px-8 py-3 rounded-lg bg-neutral-600 text-white font-medium hover:bg-neutral-500 transition-colors"
          >
            {t("common.back")}
          </button>
          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-lg bg-info-600 text-white font-medium hover:bg-info-500 transition-colors"
          >
            {t("store.continue")}
          </button>
        </div>
      </div>
    </div>
  )
}
