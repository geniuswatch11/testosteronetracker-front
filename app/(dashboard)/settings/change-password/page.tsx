"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ChangePasswordForm from "@/components/settings/change-password-form"
import { useLanguage } from "@/lib/i18n/language-context"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/settings")}
            className="text-white hover:text-neutral-400 transition-colors"
            aria-label="Back to settings"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">{t("changePassword.title")}</h1>
        </div>

        {/* Form */}
        <ChangePasswordForm />
      </div>
    </div>
  )
}
