"use client"

import { useState, useEffect } from "react"
import Stepper from "react-stepper-horizontal"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface ProfileStepperProps {
  hasWhoop: boolean
  hasPersonalData: boolean
}

export default function ProfileStepper({ hasWhoop, hasPersonalData }: ProfileStepperProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: t("stepper.connectDevice"),
      onClick: (router: ReturnType<typeof useRouter>) => router.push("/settings?section=devices"),
    },
    {
      title: t("stepper.personalData"),
      onClick: (router: ReturnType<typeof useRouter>) => router.push("/settings?section=personal-data"),
    },
  ]

  useEffect(() => {
    // Determinar el paso activo basado en el estado del perfil
    if (hasWhoop && !hasPersonalData) {
      setActiveStep(1) // Si tiene un dispositivo pero no datos personales, mostrar el paso 2
    } else if (!hasWhoop) {
      setActiveStep(0) // Si no tiene un dispositivo, mostrar el paso 1
    }
  }, [hasWhoop, hasPersonalData])

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center space-x-2 dark:bg-yellow-900/20 dark:border-yellow-800">
        <AlertTriangle className="text-yellow-500 h-5 w-5 flex-shrink-0" />
        <p className="text-sm text-yellow-700 dark:text-yellow-400">{t("dashboard.completeProfile")}</p>
      </div>
      <Stepper
        steps={steps.map((step, index) => ({
          ...step,
          onClick: () => step.onClick(router),
        }))}
        activeStep={activeStep}
        activeColor="#3B82F6"
        completeColor="#3B82F6"
        defaultColor="#9CA3AF"
        circleFontSize={16}
        titleFontSize={14}
        activeTitleColor="#3B82F6"
        completeTitleColor="#3B82F6"
        defaultTitleColor="#6B7280"
        size={32}
        circleFontColor="#FFFFFF"
        lineMarginOffset={0}
      />
    </div>
  )
}
