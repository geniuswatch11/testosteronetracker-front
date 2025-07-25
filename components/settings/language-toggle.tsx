"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/translations";
import { authApi } from "@/lib/api/auth";
import { apiRequest } from "@/lib/api/api-client";

interface LanguageToggleProps {
  initialLanguage?: Locale;
}

export function LanguageToggle({ initialLanguage }: LanguageToggleProps) {
  const { locale, setLocale, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  console.log("LanguageToggle mounted:", initialLanguage);
  // Establecer el idioma inicial cuando el componente se monta
  useEffect(() => {
    if (initialLanguage && !mounted && !isChanging) {
      setLocale(initialLanguage);
    }
  }, [initialLanguage, setLocale, mounted, isChanging]);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const updateLanguageInBackend = async (newLanguage: Locale) => {
    try {
      const { profileApi } = await import("@/lib/api/profile");
      await profileApi.updateLanguage(newLanguage);
    } catch (error) {
      console.error("Error updating language in backend:", error);
    }
  };

  const handleLanguageChange = async (newLanguage: Locale) => {
    if (isChanging) return; // Prevent multiple rapid changes

    setIsChanging(true);

    try {
      // 1. Change language locally first
      setLocale(newLanguage);

      // 2. Update cached profile immediately to prevent flickering
      const userProfile = authApi.getCachedUserProfile();
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          lenguaje: newLanguage,
        };
        localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
      }

      // 3. Make the API request
      await updateLanguageInBackend(newLanguage);
    } catch (error) {
      console.error("Failed to update language:", error);
    } finally {
      setIsChanging(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-lg font-semibold">{t("settings.language")}</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleLanguageChange("en")}
          disabled={isChanging}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
            locale === "en" ? "border-primary bg-muted" : "border-muted"
          } ${isChanging ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Globe className="h-5 w-5 mb-2" />
          <span className="text-sm">English</span>
        </button>
        <button
          onClick={() => handleLanguageChange("es")}
          disabled={isChanging}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
            locale === "es" ? "border-primary bg-muted" : "border-muted"
          } ${isChanging ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Globe className="h-5 w-5 mb-2" />
          <span className="text-sm">Español</span>
        </button>
      </div>
    </div>
  );
}
