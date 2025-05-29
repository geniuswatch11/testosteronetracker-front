"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar } from "lucide-react"
import { useIsMobile } from "@/hooks/use-is-mobile"

interface DatePickerProps {
  id: string
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  required?: boolean
  label: string
  helperText?: string
}

export default function DatePicker({
  id,
  value,
  onChange,
  min,
  max,
  required = false,
  label,
  helperText,
}: DatePickerProps) {
  const isMobile = useIsMobile()
  const [inputValue, setInputValue] = useState("")
  const nativeInputRef = useRef<HTMLInputElement>(null)
  const calendarIconRef = useRef<HTMLDivElement>(null)

  // Formatear la fecha para mostrarla en formato legible
  useEffect(() => {
    if (value) {
      const date = new Date(value)
      const formattedDate = date.toLocaleDateString()
      setInputValue(formattedDate)
    } else {
      setInputValue("")
    }
  }, [value])

  // Manejar el clic en el contenedor para abrir el selector nativo en móvil
  const handleMobileContainerClick = () => {
    // Crear un input de tipo date temporal
    const tempInput = document.createElement("input")
    tempInput.type = "date"
    tempInput.style.position = "fixed"
    tempInput.style.opacity = "0"
    tempInput.style.pointerEvents = "none"
    tempInput.style.zIndex = "-1"

    if (min) tempInput.min = min
    if (max) tempInput.max = max
    if (value) tempInput.value = value

    // Añadir el input al DOM
    document.body.appendChild(tempInput)

    // Añadir listener para capturar el cambio
    tempInput.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement
      onChange(target.value)
      document.body.removeChild(tempInput)
    })

    // Añadir listener para capturar cuando se cierra sin seleccionar
    tempInput.addEventListener("blur", () => {
      setTimeout(() => {
        if (document.body.contains(tempInput)) {
          document.body.removeChild(tempInput)
        }
      }, 300)
    })

    // Abrir el selector
    tempInput.focus()
    tempInput.click()
  }

  // Manejar el clic en el icono del calendario para PC
  const handleCalendarIconClick = () => {
    if (nativeInputRef.current) {
      nativeInputRef.current.focus()
      nativeInputRef.current.click()
    }
  }

  // Renderizar el selector para móvil
  if (isMobile) {
    return (
      <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
        <div
          className="relative w-full rounded-lg border border-gray-300 px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
          onClick={handleMobileContainerClick}
        >
          <div className="flex items-center justify-between">
            <input
              type="text"
              readOnly
              value={inputValue || "Select date"}
              className="w-full bg-transparent border-none focus:outline-none cursor-pointer"
              placeholder="Select date"
            />
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>

          {/* Input oculto para mantener el valor real */}
          <input
            id={id}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            required={required}
            className="sr-only"
          />
        </div>
        {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    )
  }

  // Renderizar el selector nativo para PC con icono de calendario separado
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={nativeInputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          required={required}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          style={{
            // Ocultar el icono nativo del calendario para reemplazarlo con nuestro propio icono
            colorScheme: "normal",
            // Añadir padding a la derecha para dejar espacio para nuestro icono
            paddingRight: "2.5rem",
          }}
        />
        {/* Icono de calendario personalizado */}
        <div
          ref={calendarIconRef}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={handleCalendarIconClick}
        >
          <Calendar className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </div>
      </div>
      {helperText && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
    </div>
  )
}
