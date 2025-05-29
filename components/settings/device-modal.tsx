"use client"

import { X } from "lucide-react"
import { useEffect, useRef } from "react"
import { useLanguage } from "@/lib/i18n/language-context"

interface DeviceOption {
  name: string
  icon: string
}

interface DeviceModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectDevice: (deviceName: string) => void
}

const deviceOptions: DeviceOption[] = [
  { name: "Fitbit", icon: "activity" },
  { name: "Apple HealthKit", icon: "heart" },
  { name: "Google Fit", icon: "activity" },
  { name: "Garmin", icon: "watch" },
  { name: "Oura", icon: "circle" },
  { name: "Polar", icon: "heart-pulse" },
  { name: "Samsung Health", icon: "heart" },
  { name: "Huawei Health", icon: "activity" },
  { name: "Xiaomi", icon: "watch" },
  { name: "Amazon Kindle", icon: "book" },
  { name: "Peloton", icon: "bike" },
  { name: "Tesla", icon: "car" },
  { name: "WearOS", icon: "watch" },
  { name: "!Health", icon: "activity" },
  { name: "Zwift", icon: "bike" },
  { name: "Google Nest", icon: "home" },
  { name: "Whoop", icon: "activity" },
]

export default function DeviceModal({ isOpen, onClose, onSelectDevice }: DeviceModalProps) {
  const { t } = useLanguage()
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      // Restore scrolling when modal is closed
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleDeviceClick = (deviceName: string) => {
    onSelectDevice(deviceName)
    onClose()
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
                onClick={() => handleDeviceClick(device.name)}
                className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors h-24"
              >
                <div className="h-10 flex items-center justify-center mb-2">
                  <span className="text-2xl">{getDeviceIcon(device.icon)}</span>
                </div>
                <span className="text-sm text-center">{device.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get emoji for device icons
function getDeviceIcon(iconName: string): string {
  switch (iconName) {
    case "activity":
      return "⌚️"
    case "heart":
      return "❤️"
    case "watch":
      return "⌚"
    case "circle":
      return "⭕"
    case "heart-pulse":
      return "💓"
    case "book":
      return "📚"
    case "bike":
      return "🚴"
    case "car":
      return "🚗"
    case "home":
      return "🏠"
    default:
      return "📱"
  }
}
