"use client"

import { useState } from "react"
import { Info } from "lucide-react"

interface InfoTooltipProps {
  description: string
}

/**
 * Componente de tooltip con icono de información
 * Muestra un tooltip al hacer hover sobre el icono
 */
export function InfoTooltip({ description }: InfoTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-8 h-8 rounded-full bg-neutral-500 flex items-center justify-center hover:bg-neutral-400 transition-colors"
        aria-label="Information"
      >
        <Info className="w-4 h-4 text-white" />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-10 z-50 w-64 bg-neutral-600 rounded-lg p-3 shadow-lg">
          <p className="text-white text-xs leading-relaxed">{description}</p>
          {/* Arrow */}
          <div className="absolute -top-2 right-3 w-4 h-4 bg-neutral-600 transform rotate-45"></div>
        </div>
      )}
    </div>
  )
}
