"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, Check, Smartphone } from "lucide-react"
import { authApi, type UserProfile } from "@/lib/api/auth"
import PersonalDataForm from "./personal-data-form"
import { ThemeToggle } from "../theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/lib/i18n/language-context"
import { Logo } from "@/components/ui/logo"
import Image from "next/image"
import DeviceModal from "./device-modal"

interface SettingsFormProps {
  userProfile: UserProfile | null
}

export default function SettingsForm({ userProfile }: SettingsFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [avatarError, setAvatarError] = useState(false)
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false)
  const [connectedDevice, setConnectedDevice] = useState<string | null>(userProfile?.has_client_id ? "Whoop" : null)

  const handleLogout = () => {
    authApi.logout()
    router.push("/login")
  }

  const handleWhoopConnect = async () => {
    try {
      // Aquí iría la lógica para conectar con Whoop
      // Por ahora, solo actualizamos el estado local
      await authApi.connectWhoop()
      // Recargar la página para obtener los datos actualizados
      window.location.reload()
    } catch (error) {
      console.error("Error connecting to Whoop:", error)
    }
  }

  const handleWhoopDisconnect = async () => {
    try {
      // Aquí iría la lógica para desconectar Whoop
      // Por ahora, solo actualizamos el estado local
      await authApi.disconnectWhoop()
      // Recargar la página para obtener los datos actualizados
      window.location.reload()
    } catch (error) {
      console.error("Error disconnecting from Whoop:", error)
    }
  }

  const handleAvatarError = () => {
    setAvatarError(true)
  }

  if (!userProfile) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Logo width={40} height={40} className="mr-3" />
        <h2 className="text-xl font-bold">{t("dashboard.settings")}</h2>
      </div>

      <div className="flex items-center space-x-4">
        {avatarError || !userProfile.avatar ? (
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
        ) : (
          <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
            <Image
              src={userProfile.avatar || "/placeholder.svg"}
              alt={userProfile.name || "User avatar"}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              onError={handleAvatarError}
            />
          </div>
        )}
        <div>
          <div className="font-medium">{userProfile.name || "Usuario"}</div>
          <div className="text-sm text-muted-foreground">{userProfile.email}</div>
        </div>
      </div>

      <div id="personal-data" className="space-y-4">
        <h2 className="text-lg font-semibold">{t("settings.personalData")}</h2>
        <PersonalDataForm userProfile={userProfile} />
      </div>

      <div id="whoop-connection" className="space-y-4">
        <h2 className="text-lg font-semibold">{t("settings.connections")}</h2>
        <div className="flex flex-col space-y-2">
          {userProfile.has_client_id && (
            <div className="flex w-full items-center justify-between rounded-lg border bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 p-4">
              <div>
                <div className="font-medium">{connectedDevice || t("settings.device")}</div>
                <div className="text-sm text-muted-foreground">{t("settings.deviceConnected")}</div>
              </div>
              <Check className="h-5 w-5 text-green-500" />
            </div>
          )}

          <button
            onClick={() => setIsDeviceModalOpen(true)}
            className="flex w-full items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div>
              <div className="font-medium">{t("settings.selectDevice")}</div>
              <div className="text-sm text-muted-foreground">
                {userProfile.has_client_id ? t("settings.changeDevice") : t("settings.deviceConnect")}
              </div>
            </div>
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          </button>

          {userProfile.has_client_id && (
            <button
              onClick={handleWhoopDisconnect}
              className="w-full rounded-lg border border-red-300 p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              {t("settings.deviceDisconnect")}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <ThemeToggle
          initialTheme={userProfile.theme === "white" ? "light" : userProfile.theme === "dark" ? "dark" : "system"}
        />
      </div>

      <div className="space-y-4">
        <LanguageToggle initialLanguage={userProfile.lenguaje} />
      </div>

      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center space-x-2 rounded-lg border border-destructive p-4 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
      >
        <LogOut className="h-5 w-5" />
        <span>{t("common.logout")}</span>
      </button>
      <DeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onSelectDevice={(deviceName) => {
          setConnectedDevice(deviceName)
          handleWhoopConnect()
        }}
      />
    </div>
  )
}
