"use client"

import { useRouter } from "next/navigation"
import { Settings } from "lucide-react"

interface ComingSoonProps {
  title?: string
  description?: string
  showButton?: boolean
  buttonText?: string
  onButtonClick?: () => void
}

export function ComingSoon({
  title = "Coming soon",
  description = "Functionality will be available in future versions of the application",
  showButton = true,
  buttonText = "Continue",
  onButtonClick,
}: ComingSoonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick()
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Card con el contenido */}
        <div className="rounded-3xl bg-neutral-600 p-12 text-center space-y-6">
          {/* Icono de configuración */}
          <div className="flex justify-center">
            <div className="rounded-full bg-primary-600 p-6">
              <Settings className="h-12 w-12 text-black" strokeWidth={2.5} />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-semibold text-white">{title}</h1>

          {/* Descripción */}
          <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
        </div>

        {/* Botón Continue */}
        {showButton && (
          <button
            onClick={handleClick}
            className="w-full rounded-full bg-primary-600 py-4 text-center text-lg font-semibold text-black transition-all hover:bg-primary-500 active:scale-95"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  )
}
