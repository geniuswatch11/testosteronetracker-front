"use client"

import { ComingSoon } from "@/components/ui/coming-soon"
import { useLanguage } from "@/lib/i18n/language-context"

export default function StatsPage() {
  const { t } = useLanguage()

  return (
    <ComingSoon
      title="Coming Soon"
      description="Stats functionality will be available in future versions of the application"
      buttonText={t("common.back")}
    />
  )
}
