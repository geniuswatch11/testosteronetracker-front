"use client"

import { X } from "lucide-react"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"
import { useDeviceConnection } from "@/hooks/use-device-connection"
import toast from "react-hot-toast"

interface DeviceOption {
  name: string
  icon: string // Ruta al icono en /public/devices
  provider: string // Identificador del proveedor para la API
}

interface DeviceModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectDevice: (deviceName: string) => void
}

const deviceOptions: DeviceOption[] = [
  { name: "Apple HealthKit", icon: "/devices/apple.png", provider: "apple" },
  { name: "Fitbit", icon: "/devices/fitbit.png", provider: "fitbit" },
  { name: "Garmin", icon: "/devices/garmin.png", provider: "garmin" },
  { name: "Google Fit", icon: "/devices/google-heat.png", provider: "google_fit" },
  { name: "Whoop", icon: "/devices/whoop.png", provider: "whoop" },
]

export default function DeviceModal({ isOpen, onClose, onSelectDevice }: DeviceModalProps) {
  const { t } = useLanguage()
  const modalRef = useRef<HTMLDivElement>(null)
  const { isLoading, error, connectDevice, resetConnection } = useDeviceConnection()

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen && !isLoading) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      // Restore scrolling when modal is closed
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose, isLoading])

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose, isLoading])

  // Manejar errores
  useEffect(() => {
    if (error) {
      toast.error(t(error) || error)
      resetConnection()
      onClose()
    }
  }, [error, t, resetConnection, onClose])

  if (!isOpen) return null

  const handleDeviceClick = async (device: DeviceOption) => {
    onSelectDevice(device.name)
    
    try {
      // Iniciar el proceso de conexión (redirigirá a /synchronizing)
      await connectDevice(device.provider)
      // Cerrar el modal después de iniciar la conexión
      onClose()
    } catch (err) {
      // Los errores se manejan en el useEffect
      console.error("Error connecting device:", err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className="relative w-full max-w-md max-h-[80vh] bg-background rounded-lg shadow-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{t("settings.selectDevice")}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 max-h-[calc(80vh-4rem)]">
          <div className="grid grid-cols-2 gap-4">
            {deviceOptions.map((device) => (
              <button
                key={device.name}
                onClick={() => handleDeviceClick(device)}
                className="flex flex-col items-center justify-center p-6 rounded-lg border border-neutral-700 hover:border-primary-600 hover:bg-neutral-800/50 transition-all h-32 group"
              >
                <div className="h-14 w-14 flex items-center justify-center mb-3 relative">
                  <Image
                    src={device.icon}
                    alt={device.name}
                    width={56}
                    height={56}
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="text-sm text-center font-medium">{device.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
