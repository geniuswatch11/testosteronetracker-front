"use client"

import { Smartphone, User, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"

interface ConfigurationSetupProps {
  spikeConnected: boolean
  isComplete: boolean
}

export function ConfigurationSetup({ spikeConnected, isComplete }: ConfigurationSetupProps) {
  const { t } = useLanguage()

  const steps = [
    {
      id: "device",
      icon: Smartphone,
      label: t("dashboard.device"),
      status: spikeConnected ? t("dashboard.deviceConnected") : t("dashboard.deviceNotConnected"),
      isComplete: spikeConnected,
      href: "/settings",
    },
    {
      id: "profile",
      icon: User,
      label: t("dashboard.profile"),
      status: isComplete ? t("dashboard.profileConnected") : t("dashboard.deviceNotConnected"),
      isComplete: isComplete,
      href: "/settings",
    },
  ]

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">

        {/* Card principal */}
        <div className="bg-neutral-600 rounded-3xl p-8 space-y-8">

        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-neutral-600 rounded-2xl flex items-center justify-center">
            <Image
              src="/logo_2.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
        </div>

          {/* Título */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-white">
              {t("dashboard.configurationSetup")}
            </h1>
            <p className="text-sm text-neutral-400">
              {t("dashboard.completeAllSteps")}
            </p>
          </div>

          {/* Lista de pasos */}
          <div className="space-y-6">
            {steps.map((step) => (
              <Link
                key={step.id}
                href={step.href}
                className={`flex items-center gap-4 transition-all ${
                  step.isComplete
                    ? "bg-primary-green-600/20 border-2 border-primary-green-600 rounded-2xl p-4"
                    : ""
                }`}
              >
                {/* Icono */}
                <div className="flex-shrink-0">
                  <step.icon
                    className={`w-6 h-6 ${
                      step.isComplete ? "text-white" : "text-neutral-400"
                    }`}
                  />
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-white">
                    {step.label}
                  </h3>
                  <p
                    className={`text-sm ${
                      step.isComplete ? "text-neutral-300" : "text-neutral-400"
                    }`}
                  >
                    {step.status}
                  </p>
                </div>

                {/* Check mark */}
                {step.isComplete && (
                  <div className="flex-shrink-0">
                    <Check className="w-6 h-6 text-primary-green-600" strokeWidth={3} />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
