"use client"
import { useLanguage } from "@/lib/i18n/language-context"
import SettingsClientPage from "./settings-client-page"

export default function SettingsPage() {
  const { t } = useLanguage()

  return <SettingsClientPage />
}
