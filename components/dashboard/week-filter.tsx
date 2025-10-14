"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Filter } from "lucide-react"

interface WeekFilterProps {
  dates: string[]
  startDate: string | null
  endDate: string | null
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void
}

/**
 * Componente de filtro de días
 * Muestra los días disponibles y permite seleccionar un rango (start y end) para filtrar las gráficas
 */
export function WeekFilter({ dates, startDate, endDate, onDateRangeChange }: WeekFilterProps) {
  const [showAllDates, setShowAllDates] = useState(false)

  // Formatear las fechas para mostrar
  const formattedDates = useMemo(() => {
    return dates.map((dateStr) => {
      const date = new Date(dateStr)
      return {
        dateStr,
        dayName: format(date, "EEE"),
        dayNumber: format(date, "d"),
        monthName: format(date, "MMM"),
        fullDate: format(date, "MMM d, yyyy"),
      }
    })
  }, [dates])

  // Mostrar solo los primeros 7 días o todos
  const displayedDates = showAllDates ? formattedDates : formattedDates.slice(0, 7)

  // Manejar clic en un día
  const handleDateClick = (dateStr: string) => {
    if (!startDate) {
      // Si no hay fecha de inicio, establecer como inicio
      onDateRangeChange(dateStr, null)
    } else if (!endDate) {
      // Si hay inicio pero no fin, establecer como fin
      // Asegurar que endDate sea mayor que startDate
      const start = new Date(startDate)
      const end = new Date(dateStr)
      if (end >= start) {
        onDateRangeChange(startDate, dateStr)
      } else {
        // Si la fecha es menor, invertir el rango
        onDateRangeChange(dateStr, startDate)
      }
    } else {
      // Si ya hay rango completo, reiniciar con nueva fecha de inicio
      onDateRangeChange(dateStr, null)
    }
  }

  // Determinar si una fecha está en el rango seleccionado
  const isInRange = (dateStr: string) => {
    if (!startDate) return false
    if (!endDate) return dateStr === startDate
    
    const date = new Date(dateStr)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return date >= start && date <= end
  }

  // Determinar si es el inicio o fin del rango
  const isRangeEdge = (dateStr: string) => {
    return dateStr === startDate || dateStr === endDate
  }

  return (
    <div className="space-y-4">
      {/* Header con título y filtro */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Data Records</h2>
        
        {/* Botón de filtro */}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2A2A] text-white hover:bg-neutral-600 transition-colors"
          onClick={() => setShowAllDates(!showAllDates)}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filters</span>
        </button>
      </div>

      {/* Días disponibles */}
      <div className="grid grid-cols-7 gap-2">
        {displayedDates.map((day) => {
          const inRange = isInRange(day.dateStr)
          const isEdge = isRangeEdge(day.dateStr)
          
          return (
            <button
              key={day.dateStr}
              onClick={() => handleDateClick(day.dateStr)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isEdge
                  ? "bg-primary-600 text-black"
                  : inRange
                  ? "bg-primary-600/50 text-white"
                  : "bg-[#2A2A2A] text-white hover:bg-neutral-600"
              }`}
            >
              <p className={`text-xs ${isEdge ? "text-black/70" : inRange ? "text-white/70" : "text-neutral-400"}`}>
                {day.dayName}
              </p>
              <p className="text-sm font-bold">{day.dayNumber}</p>
            </button>
          )
        })}
      </div>

      {/* Mostrar más fechas si hay más de 7 */}
      {dates.length > 7 && (
        <div className="flex items-center justify-center">
          <button
            onClick={() => setShowAllDates(!showAllDates)}
            className="text-primary-600 text-sm hover:underline"
          >
            {showAllDates ? "Show less" : `Show all ${dates.length} days`}
          </button>
        </div>
      )}
    </div>
  )
}
