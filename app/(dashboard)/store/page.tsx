"use client"

import { ComingSoon } from "@/components/ui/coming-soon"
import { useLanguage } from "@/lib/i18n/language-context"

export default function StorePage() {
  const { t } = useLanguage()

  return (
    <ComingSoon
      title="Coming Soon"
      description="Store functionality will be available in future versions of the application"
      buttonText={t("common.back")}
    />
  )
}
