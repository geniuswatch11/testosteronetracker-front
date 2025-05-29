"use client"

import { WifiOff } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface ConnectionErrorProps {
  message?: string
}

export function ConnectionError({ message }: ConnectionErrorProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full">
        <WifiOff className="h-12 w-12 text-red-500 dark:text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">{t("errors.connectionTitle")}</h3>
      <p className="text-muted-foreground max-w-md">{message || t("errors.connectionMessage")}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        {t("errors.retry")}
      </button>
    </div>
  )
}
