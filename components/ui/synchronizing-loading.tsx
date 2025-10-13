"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"

interface SynchronizingLoadingProps {
  title?: string
  description?: string
}

export function SynchronizingLoading({
  title,
  description,
}: SynchronizingLoadingProps) {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo animado */}
        <div className="flex justify-center">
          <div className="animate-pulse">
            <div className="w-32 h-32 flex items-center justify-center">
              <Image
                src="/logo_2.png"
                alt="Loading"
                width={128}
                height={128}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-3">
          <h1 className="text-xl font-semibold text-white">
            {title || t("loading.synchronizing")}
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {description || t("loading.preparingData")}
          </p>
        </div>
      </div>
    </div>
  )
}
