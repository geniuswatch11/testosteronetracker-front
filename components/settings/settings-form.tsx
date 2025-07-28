"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Check, Smartphone } from "lucide-react";
import { authApi, type UserProfile } from "@/lib/api/auth";
import PersonalDataForm from "./personal-data-form";
import { ThemeToggle } from "../theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "@/lib/i18n/language-context";
import { Logo } from "../ui/logo";
import Image from "next/image";
import DeviceModal from "./device-modal";
import { profileApi } from "@/lib/api/profile";
import toast from "react-hot-toast";
import { tree } from "next/dist/build/templates/app-page";

interface SettingsFormProps {
  userProfile: UserProfile | null;
  setIsLoading?: (loading: boolean) => void; // Optional prop to control loading state
  setUserProfile: (profile: UserProfile) => void; // Optional prop to control user profile state
  setDeviceConnected?: any; // Optional prop to control connected device state
  deviceConnected?: string; // Optional prop to display connected device
}

export default function SettingsForm({
  userProfile,
  setIsLoading,
  deviceConnected,
  setDeviceConnected,
  setUserProfile,
}: SettingsFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [avatarError, setAvatarError] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);

  const handleLogout = () => {
    authApi.logout();
    router.push("/login");
  };

  const handleWhoopConnect = async (deviceName: string) => {
    if (setIsLoading) setIsLoading(true);
    setConnectedDevice(deviceName);
    profileApi
      .connectDevice(deviceName)
      .then(() => {
        if (setIsLoading) setIsLoading(true);
      })
      .catch(() => {
        if (setIsLoading) setIsLoading(false);
      });
  };

  const handleWhoopDisconnect = async () => {
    profileApi.disconnectWhoop();
    setDeviceConnected("");
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  if (!userProfile) {
    return null;
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
              alt={userProfile.email || "User avatar"}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              onError={handleAvatarError}
            />
          </div>
        )}
        <div>
          <div className="font-medium">{userProfile.email || "Usuario"}</div>
          <div className="text-sm text-muted-foreground">
            {userProfile.email}
          </div>
        </div>
      </div>

      <div id="personal-data" className="space-y-4">
        <h2 className="text-lg font-semibold">{t("settings.personalData")}</h2>
        <PersonalDataForm
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />
      </div>

      <div id="whoop-connection" className="space-y-4">
        <h2 className="text-lg font-semibold">{t("settings.connections")}</h2>
        <div className="flex flex-col space-y-2">
          {deviceConnected !== "" && (
            <div className="flex w-full items-center justify-between rounded-lg border bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 p-4">
              <div>
                <div className="font-medium">
                  {connectedDevice || t("settings.device")}: {deviceConnected}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("settings.deviceConnected")}
                </div>
              </div>
              <Check className="h-5 w-5 text-green-500" />
            </div>
          )}
          {deviceConnected === "" && (
            <button
              onClick={() => {
                if (userProfile.profile_completion_percentage === 100) {
                  setIsDeviceModalOpen(true);
                } else {
                  toast.error(t("settings.errorConnection"));
                }
              }}
              className="flex w-full items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div>
                <div className="font-medium">{t("settings.selectDevice")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("settings.deviceConnect")}
                </div>
              </div>
              <Smartphone className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          {deviceConnected !== "" && (
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
          initialTheme={
            userProfile.theme === "white"
              ? "light"
              : userProfile.theme === "dark"
              ? "dark"
              : "system"
          }
        />
      </div>

      <div className="space-y-4">
        <LanguageToggle
          initialLanguage={userProfile.lenguaje ? userProfile.lenguaje : "en"}
        />
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
          handleWhoopConnect(deviceName);
        }}
      />
    </div>
  );
}
