"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface TimeFilterProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  onRefresh?: () => void
}

/**
 * Componente de filtro de tiempo para los gráficos de stats
 * Incluye navegación Today y selección de período (4w, 3w, 2w, 1w)
 * Los botones de período llaman al backend con el filtro correspondiente
 */
export function TimeFilter({ selectedPeriod, onPeriodChange, onRefresh }: TimeFilterProps) {
  const periods = ["4w", "3w", "2w", "1w"]

  const handlePeriodChange = (period: string) => {
    onPeriodChange(period)
    // Trigger refresh to fetch data with new period
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Today Navigation */}
      <div className="flex items-center gap-2 bg-neutral-600 rounded-full px-2 py-2">
        <button
          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-500 rounded-full transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <span className="text-white text-sm font-medium px-4">Today</span>
        <button
          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-500 rounded-full transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => handlePeriodChange(period)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedPeriod === period
                ? "bg-white text-black"
                : "bg-neutral-600 text-neutral-400 hover:text-white hover:bg-neutral-500"
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  )
}
