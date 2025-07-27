"use client";

import { useEffect, useState } from "react";
import SettingsForm from "@/components/settings/settings-form";
import { SettingsSkeleton } from "@/components/settings/settings-skeleton";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";
import { authApi, type UserProfile } from "@/lib/api/auth";
import { InitializingLoader } from "@/components/dashboard/initializing-loader";
import { ConnectionError } from "@/components/dashboard/connection-error";
import { useTheme } from "next-themes";
import { profileApi } from "@/lib/api/profile";

export default function SettingsClientPage() {
  const searchParams = useSearchParams();
  const { t, setLocale } = useLanguage();
  const { setTheme } = useTheme();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(
    {} as UserProfile
  );
  const [error, setError] = useState<string | null>(null);
  const [themeInitialized, setThemeInitialized] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Obtener el perfil del usuario
        const profile = await authApi.getUserProfile();
        const myDevice = await profileApi.getMyDevice();

        console.log("User profile loaded:", profile);
        setUserProfile(profile);
        setDeviceConnected(myDevice?.provider || "");
        // Configurar el tema según las preferencias del usuario
        // Only set theme once during initialization
        if (!themeInitialized) {
          if (profile.theme === "white") {
            setTheme("light");
          } else if (profile.theme === "dark") {
            setTheme("dark");
          } else {
            setTheme("system");
          }
          setThemeInitialized(true);
        }

        // Configurar el idioma según las preferencias del usuario
        const locale = profile.lenguaje || "en";
        console.log("Setting locale to:", locale);
        setLocale(locale);

        // Finalizar la inicialización
        setIsInitializing(false);

        // Simular tiempo de carga para mostrar el esqueleto
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error loading user profile:", error);
        setIsInitializing(false);
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [setTheme, setLocale, t, themeInitialized]);

  useEffect(() => {
    if (!isLoading && !error) {
      const section = searchParams.get("section");
      if (section === "personal-data") {
        const element = document.getElementById("personal-data");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else if (section === "whoop") {
        const element = document.getElementById("whoop-connection");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [searchParams, isLoading, error]);

  // Mostrar pantalla de inicialización mientras se carga el perfil y se configura la app
  if (isInitializing) {
    return <InitializingLoader />;
  }

  if (isLoading) {
    return (
      <main className="container mx-auto max-w-md px-4 py-6">
        <SettingsSkeleton />
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-6">
      {/* Eliminado el título duplicado */}
      <div className="mt-6">
        <SettingsForm
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          setIsLoading={setIsLoading}
          deviceConnected={deviceConnected}
          setDeviceConnected={setDeviceConnected}
        />
      </div>
    </main>
  );
}
