"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Skeleton } from "@/components/ui/skeleton"

interface TestosteroneValueProps {
  value: number | null
  birthDate: string | null
  isLoading: boolean
}

// Rangos de testosterona por edad
const TESTOSTERONE_RANGES = {
  "18-25": { veryLow: 300, low: 400, normalLow: 500, normalHigh: 700, high: 850 },
  "26-35": { veryLow: 280, low: 370, normalLow: 450, normalHigh: 650, high: 800 },
  "36-45": { veryLow: 260, low: 350, normalLow: 430, normalHigh: 630, high: 750 },
  "46-55": { veryLow: 240, low: 330, normalLow: 410, normalHigh: 600, high: 720 },
  "56-65": { veryLow: 220, low: 300, normalLow: 380, normalHigh: 570, high: 700 },
  "66+": { veryLow: 200, low: 280, normalLow: 360, normalHigh: 530, high: 650 },
}

// Función para calcular la edad a partir de la fecha de nacimiento
export const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birthDateObj = new Date(birthDate)
  let age = today.getFullYear() - birthDateObj.getFullYear()
  const monthDiff = today.getMonth() - birthDateObj.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--
  }

  return age
}

// Función para determinar el rango de edad para los rangos de testosterona
const getAgeRange = (age: number): keyof typeof TESTOSTERONE_RANGES => {
  if (age <= 25) return "18-25"
  if (age <= 35) return "26-35"
  if (age <= 45) return "36-45"
  if (age <= 55) return "46-55"
  if (age <= 65) return "56-65"
  return "66+"
}

// Función para determinar el estado de la testosterona según el valor y la edad
const getTestosteroneStatus = (
  value: number,
  birthDate: string,
): {
  status: "veryLow" | "low" | "normalLow" | "normalMid" | "normalHigh" | "high"
  color: string
  label: string
} => {
  const age = calculateAge(birthDate)
  const ageRange = getAgeRange(age)
  const ranges = TESTOSTERONE_RANGES[ageRange]

  if (value < ranges.veryLow) {
    return { status: "veryLow", color: "text-red-600", label: "verylow" }
  } else if (value < ranges.low) {
    return { status: "low", color: "text-orange-500", label: "low" }
  } else if (value < ranges.normalLow) {
    return { status: "normalLow", color: "text-yellow-500", label: "normallow" }
  } else if (value < ranges.normalHigh) {
    return { status: "normalMid", color: "text-green-500", label: "normal" }
  } else if (value < ranges.high) {
    return { status: "normalHigh", color: "text-blue-500", label: "normalhigh" }
  } else {
    return { status: "high", color: "text-purple-500", label: "high" }
  }
}

export default function TestosteroneValue({ value, birthDate, isLoading }: TestosteroneValueProps) {
  const { t } = useLanguage()
  const [showTooltip, setShowTooltip] = useState(false)

  if (isLoading) {
    return (
      <div className="h-10 flex items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }

  if (value === null || !birthDate) {
    return (
      <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{t("charts.testosteroneAnalyzing")}</div>
    )
  }

  const { color, label } = getTestosteroneStatus(value, birthDate)

  return (
    <div className="relative inline-flex items-center">
      <div className={`text-4xl font-bold ${color}`}>{value.toFixed(0)} ng/dL</div>
      <div className="relative ml-2">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Testosterone level information"
        >
          <Info className="h-5 w-5" />
        </button>

        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 text-sm">
            <div className="font-medium mb-1">
              {t("dashboard.testosteroneStatus")}:{" "}
              <span className={color}>{t(`dashboard.testosteroneLevel.${label}`)}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">{t("dashboard.testosteroneInfo")}</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  )
}
