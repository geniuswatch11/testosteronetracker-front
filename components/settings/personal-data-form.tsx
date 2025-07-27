"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { profileApi } from "@/lib/api/profile";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";
import DatePicker from "./date-picker";
import type { UserProfile } from "@/lib/api/auth";

export type UserProfileData = {
  weight: number;
  height: number;
  birthDate: string;
  first_name: string;
  last_name: string;
};

interface PersonalDataFormProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
}

export default function PersonalDataForm({
  userProfile,
  setUserProfile,
}: PersonalDataFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UserProfileData>({
    weight: 0,
    height: 0,
    birthDate: "",
    first_name: "",
    last_name: "",
  });

  // Calcular la fecha máxima (13 años atrás desde hoy)
  // Esta es la fecha más reciente que se puede seleccionar (alguien que tiene exactamente 13 años)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // No establecemos fecha mínima, para permitir cualquier edad mayor a 13 años
  // Podríamos establecer una fecha mínima razonable si fuera necesario, por ejemplo 100 años atrás
  const minDate = "1900-01-01"; // Fecha mínima razonable

  useEffect(() => {
    if (userProfile) {
      setData({
        weight: userProfile.weight || 0,
        height: userProfile.height || 0,
        birthDate: userProfile.birth_date || "",
        first_name: (userProfile as any).first_name || "",
        last_name: (userProfile as any).last_name || "",
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Enviar los datos al servidor
      const response = await profileApi.updatePersonalData({
        first_name: data.first_name,
        last_name: data.last_name,
        weight: data.weight,
        height: data.height,
        birthDate: data.birthDate,
      });
      console.log("Personal data updated successfully:", response);
      setUserProfile({
        ...(userProfile as UserProfile),
        first_name: data.first_name,
        last_name: data.last_name,
        weight: data.weight,
        height: data.height,
        birth_date: data.birthDate,
        profile_completion_percentage: 100, // Assuming profile is now complete
      });

      toast.success(t("settings.dataSaved"));
    } catch (error) {
      toast.error(t("settings.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium mb-1"
          >
            {t("settings.firstName")}
          </label>
          <input
            id="first_name"
            type="text"
            required
            value={data.first_name}
            onChange={(e) => setData({ ...data, first_name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium mb-1">
            {t("settings.lastName")}
          </label>
          <input
            id="last_name"
            type="text"
            required
            value={data.last_name}
            onChange={(e) => setData({ ...data, last_name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium mb-1">
            {t("settings.weight")}
          </label>
          <input
            id="weight"
            type="number"
            min="66"
            max="660"
            step="0.1"
            required
            value={data.weight || ""}
            onChange={(e) =>
              setData({ ...data, weight: Number.parseFloat(e.target.value) })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium mb-1">
            {t("settings.height")}
          </label>
          <input
            id="height"
            type="number"
            min="3"
            max="8"
            step="0.1"
            required
            value={data.height || ""}
            onChange={(e) =>
              setData({ ...data, height: Number.parseFloat(e.target.value) })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t("settings.heightFeet")}
          </p>
        </div>

        <DatePicker
          id="birthDate"
          label={t("settings.birthDate")}
          value={data.birthDate}
          onChange={(value) => setData({ ...data, birthDate: value })}
          min={minDate}
          max={maxDate}
          required
          helperText={t("settings.minAge")}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? t("common.saving") : t("settings.saveData")}
      </button>
    </form>
  );
}
