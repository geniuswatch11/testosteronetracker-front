"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { calculateAge } from "@/components/dashboard/testosterone-value"
import { Skeleton } from "@/components/ui/skeleton"

interface TestosteroneTableProps {
  birthDate: string | null
  testosteroneValue: number | null
  isLoading: boolean
}

// Rangos de testosterona por edad
const TESTOSTERONE_RANGES = {
  "18-25": [
    { label: "verylow", range: "< 300", max: 299 },
    { label: "low", range: "300–399", min: 300, max: 399 },
    { label: "normallow", range: "400–499", min: 400, max: 499 },
    { label: "normal", range: "500–699", min: 500, max: 699 },
    { label: "normalhigh", range: "700–850", min: 700, max: 850 },
    { label: "high", range: "> 850", min: 851 },
  ],
  "26-35": [
    { label: "verylow", range: "< 280", max: 279 },
    { label: "low", range: "280–369", min: 280, max: 369 },
    { label: "normallow", range: "370–449", min: 370, max: 449 },
    { label: "normal", range: "450–649", min: 450, max: 649 },
    { label: "normalhigh", range: "650–800", min: 650, max: 800 },
    { label: "high", range: "> 800", min: 801 },
  ],
  "36-45": [
    { label: "verylow", range: "< 260", max: 259 },
    { label: "low", range: "260–349", min: 260, max: 349 },
    { label: "normallow", range: "350–429", min: 350, max: 429 },
    { label: "normal", range: "430–630", min: 430, max: 630 },
    { label: "normalhigh", range: "630–750", min: 630, max: 750 },
    { label: "high", range: "> 750", min: 751 },
  ],
  "46-55": [
    { label: "verylow", range: "< 240", max: 239 },
    { label: "low", range: "240–329", min: 240, max: 329 },
    { label: "normallow", range: "330–409", min: 330, max: 409 },
    { label: "normal", range: "410–599", min: 410, max: 599 },
    { label: "normalhigh", range: "600–720", min: 600, max: 720 },
    { label: "high", range: "> 720", min: 721 },
  ],
  "56-65": [
    { label: "verylow", range: "< 220", max: 219 },
    { label: "low", range: "220–299", min: 220, max: 299 },
    { label: "normallow", range: "300–379", min: 300, max: 379 },
    { label: "normal", range: "380–570", min: 380, max: 570 },
    { label: "normalhigh", range: "570–700", min: 570, max: 700 },
    { label: "high", range: "> 700", min: 701 },
  ],
  "66+": [
    { label: "verylow", range: "< 200", max: 199 },
    { label: "low", range: "200–279", min: 200, max: 279 },
    { label: "normallow", range: "280–359", min: 280, max: 359 },
    { label: "normal", range: "360–530", min: 360, max: 530 },
    { label: "normalhigh", range: "530–650", min: 530, max: 650 },
    { label: "high", range: "> 650", min: 651 },
  ],
}

// Función para determinar el rango de edad para los rangos de testosterona
export const getAgeRange = (age: number): keyof typeof TESTOSTERONE_RANGES => {
  if (age <= 25) return "18-25"
  if (age <= 35) return "26-35"
  if (age <= 45) return "36-45"
  if (age <= 55) return "46-55"
  if (age <= 65) return "56-65"
  return "66+"
}

// Función para determinar el estado de la testosterona según el valor y la edad
export const getTestosteroneStatus = (value: number, birthDate: string): string => {
  const age = calculateAge(birthDate)
  const ageRange = getAgeRange(age)
  const ranges = TESTOSTERONE_RANGES[ageRange]

  for (const range of ranges) {
    if (range.min && range.max) {
      if (value >= range.min && value <= range.max) {
        return range.label
      }
    } else if (range.min) {
      if (value >= range.min) {
        return range.label
      }
    } else if (range.max) {
      if (value <= range.max) {
        return range.label
      }
    }
  }

  return "normal" // Default fallback
}

export default function TestosteroneTable({ birthDate, testosteroneValue, isLoading }: TestosteroneTableProps) {
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("charts.testosteroneTable")}</h2>
        <div className="w-full">
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!birthDate || testosteroneValue === null) {
    return null
  }

  const age = calculateAge(birthDate)
  const ageRange = getAgeRange(age)
  const ranges = TESTOSTERONE_RANGES[ageRange]
  const currentStatus = getTestosteroneStatus(testosteroneValue, birthDate)

  // Colores para los diferentes rangos
  const getColorClass = (label: string) => {
    switch (label) {
      case "verylow":
        return "bg-red-600 text-white"
      case "low":
        return "bg-orange-500 text-white"
      case "normallow":
        return "bg-yellow-500 text-black"
      case "normal":
        return "bg-green-500 text-white"
      case "normalhigh":
        return "bg-blue-500 text-white"
      case "high":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  // Determinar si la celda está activa (contiene el valor actual)
  const isActive = (label: string) => {
    return label === currentStatus
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("charts.testosteroneTable")}</h2>
      <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-3 shadow-sm" style={{ scrollbarWidth: "none" }}>
        <table className="w-full border-collapse overflow-hidden rounded-lg table-fixed">
          <thead>
            <tr>
              <th className="px-1 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-tl-lg">
                {t("charts.ageRange")}
              </th>
              {ranges.map((range, index) => (
                <th
                  key={range.label}
                  className={`px-1 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 ${
                    index === ranges.length - 1 ? "rounded-tr-lg" : ""
                  }`}
                >
                  {t(`dashboard.testosteroneLevel.${range.label}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-1 py-1 text-xs font-medium text-center border-t border-gray-200 dark:border-gray-700 rounded-bl-lg">
                {ageRange} {t("charts.years")}
              </td>
              {ranges.map((range, index) => (
                <td
                  key={range.label}
                  className={`px-1 py-1 text-xs text-center border-t border-gray-200 dark:border-gray-700 transition-colors ${
                    isActive(range.label) ? `${getColorClass(range.label)} font-bold` : ""
                  } ${index === ranges.length - 1 ? "rounded-br-lg" : ""}`}
                >
                  <div className="font-medium text-[10px]">{range.range}</div>
                  {isActive(range.label) && <div className="mt-1 text-[10px] font-bold">{testosteroneValue} ng/dL</div>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground text-center px-4">{t("charts.testosteroneTableNote")}</p>
    </div>
  )
}
