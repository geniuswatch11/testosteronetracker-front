"use client"

import { Bell } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function NotificationsPage() {
  const { t } = useLanguage()

  return (
    <main className="container mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold text-center">{t("dashboard.notifications")}</h1>
      <div className="mt-6">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border p-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground" />
          <div className="text-lg font-medium">{t("dashboard.noNotifications")}</div>
          <p className="text-sm text-muted-foreground">{t("dashboard.noNotificationsDesc")}</p>
        </div>
      </div>
    </main>
  )
}
