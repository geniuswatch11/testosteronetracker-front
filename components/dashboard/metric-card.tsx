"use client"

import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  variant?: "default" | "primary" | "success"
}

/**
 * Componente de tarjeta de métrica
 * Muestra un icono, valor y etiqueta en un diseño compacto
 */
export function MetricCard({ icon: Icon, value, label, variant = "default" }: MetricCardProps) {
  return (
    <div className="bg-[#2A2A2A] rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
      {/* Icono */}
      <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* Valor */}
      <p className="text-white text-2xl font-bold">{value}</p>
      
      {/* Label */}
      <p className="text-neutral-400 text-xs">{label}</p>
    </div>
  )
}
