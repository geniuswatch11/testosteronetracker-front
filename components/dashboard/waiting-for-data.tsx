"use client"

import Image from "next/image"

interface WaitingForDataProps {
  message?: string
  errorMessage?: string
}

/**
 * Componente que muestra el logo con un mensaje de espera de datos
 * Se muestra cuando el dispositivo está conectado pero no hay datos disponibles
 */
export function WaitingForData({ message, errorMessage }: WaitingForDataProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Card con el contenido */}
        <div className="rounded-3xl bg-neutral-600 p-12 text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo_2.png"
              alt="Genius Logo"
              width={120}
              height={120}
              priority
              className="animate-pulse"
            />
          </div>

          {/* Mensaje principal */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-white">
              {message || "Sin datos"}
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Esperando datos del dispositivo...
            </p>
          </div>

          {/* Mensaje de error si existe */}
          {errorMessage && (
            <div className="mt-4 rounded-lg bg-danger-600/10 border border-danger-600/20 p-4">
              <p className="text-sm text-danger-400">{errorMessage}</p>
            </div>
          )}

          {/* Mensaje de éxito si no hay error */}
          {!errorMessage && message === "Datos obtenidos correctamente" && (
            <div className="mt-4 rounded-lg bg-primary-green-600/10 border border-primary-green-600/20 p-4">
              <p className="text-sm text-primary-green-500">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
