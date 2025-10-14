"use client"

import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function ChangePasswordSuccessPage() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleContinue = () => {
    router.push("/settings")
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-8">
        {/* Check Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center">
            <Check className="w-12 h-12 text-black" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-bold text-white">
            {t("changePassword.successTitle")}
          </h1>
          <p className="text-sm text-neutral-400">
            {t("changePassword.successMessage")}
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full rounded-full py-4 bg-primary-600 text-black font-semibold hover:bg-primary-500 transition-all active:scale-95"
        >
          {t("changePassword.continue")}
        </button>
      </div>
    </div>
  )
}
