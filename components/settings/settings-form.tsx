"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ModernDatePicker from "@/components/settings/modern-date-picker"
// comentario-dev: import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/settings/language-toggle"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/hooks/use-auth"
import { userApi } from "@/lib/api/user"
import { authApi } from "@/lib/api/auth"
import type { UserProfileData } from "@/lib/types/api"

const settingsSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().default(""),
  gender: yup.string().oneOf(["male", "female", "binary", "other", ""], "Invalid gender").default("other"),
  weight: yup.number().nullable().default(null).transform((value, originalValue) => 
    originalValue === "" || originalValue === null ? null : value
  ),
  height: yup.string().default(""),
  birth_date: yup.date().nullable().default(null),
  avatar: yup.string().default(""),
});

type SettingsFormData = {
  username: string;
  password: string;
  gender: "" | "male" | "female" | "binary" | "other";
  weight: number | null;
  height: string;
  birth_date: Date | null;
  avatar: string;
};

interface SettingsFormProps {
  userProfile: UserProfileData | null;
  avatars: string[];
  onProfileUpdated?: () => void; // Callback para refrescar el perfil
}

export default function SettingsForm({ userProfile, avatars, onProfileUpdated }: SettingsFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { logout } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatar || avatars[0] || "");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, setValue, watch, reset, setError, formState: { errors, dirtyFields } } = 
  useForm<SettingsFormData>({
    resolver: yupResolver(settingsSchema),
    defaultValues: {
      username: "",
      password: "",
      gender: "other", // Default a "other" en lugar de "" para evitar problemas con el Select
      weight: null,
      height: "",
      birth_date: null,
      avatar: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      // Normalizar gender: si es vacío, null o undefined, usar "other" como default
      const normalizedGender = (userProfile.gender || "other") as "" | "male" | "female" | "binary" | "other";

      const values: SettingsFormData = {
        username: userProfile.username,
        password: "",
        gender: normalizedGender,
        weight: userProfile.weight,
        height: userProfile.height ? String(userProfile.height) : "",
        birth_date: userProfile.birth_date ? new Date(userProfile.birth_date) : null,
        avatar: userProfile.avatar || "",
      };
      
      console.log("🔍 Cargando perfil - gender:", userProfile.gender, "→ normalizado:", normalizedGender);
      
      // Usar reset() para establecer valores iniciales y marcar formulario como pristine
      reset(values);
      
      if (userProfile.avatar) {
        setSelectedAvatar(userProfile.avatar);
      }
    }
  }, [userProfile]);

  // Helper para formatear fecha a YYYY-MM-DD
  const formatDateToAPI = (date: Date | null | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      const userCached = authApi.getCachedUserProfile();
      
      // Construir payload SOLO con campos modificados (dirty)
      const profileData: any = {};
      let hasChanges = false;

      // Agregar solo los campos que fueron modificados
      Object.keys(dirtyFields).forEach((key) => {
        const fieldKey = key as keyof SettingsFormData;
        if (dirtyFields[fieldKey]) {
          hasChanges = true;
          // Formatear valores según el tipo de campo
          if (fieldKey === 'birth_date') {
            profileData[fieldKey] = formatDateToAPI(data[fieldKey]);
          } else if (fieldKey === 'weight') {
            profileData[fieldKey] = data[fieldKey]?.toString() || "";
          } else if (fieldKey === 'height') {
            profileData[fieldKey] = data[fieldKey] || "";
          } else if (fieldKey === 'gender') {
            profileData[fieldKey] = data[fieldKey] || "other";
          } else if (fieldKey === 'username') {
            profileData[fieldKey] = data[fieldKey];
          } else if (fieldKey !== 'password' && fieldKey !== 'avatar') {
            // Excluir password y avatar (se manejan por separado)
            profileData[fieldKey] = data[fieldKey];
          }
        }
      });

      // Enviar solo si hay campos modificados (excluyendo avatar)
      if (Object.keys(profileData).length > 0) {
        await userApi.updateProfile(profileData);
      }
      
      // Manejar avatar por separado
      if (dirtyFields.avatar) {
        await userApi.updateAvatar(selectedAvatar);
        hasChanges = true;
      }
      
      if (hasChanges) {
        toast.success(t("settings.dataSaved"));
        
        // Refrescar el perfil desde el backend
        if (onProfileUpdated) {
          await onProfileUpdated();
        }
        
        // Resetear el estado dirty del formulario
        reset(data, { keepValues: true });
      }
      // Si no hay cambios, no mostrar ninguna alerta
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Manejar errores de validación según el contrato de API
      if (error.response?.data?.error && typeof error.response.data.error === 'object') {
        const validationErrors = error.response.data.error;
        
        const fieldMapping: { [key: string]: keyof SettingsFormData } = {
          'username': 'username',
          'gender': 'gender',
          'weight': 'weight',
          'height': 'height',
          'birth_date': 'birth_date',
        };
        
        let hasSetError = false;
        Object.entries(validationErrors).forEach(([field, messages]: [string, any]) => {
          const formFieldName = fieldMapping[field];
          if (formFieldName) {
            const errorMessage = Array.isArray(messages) ? messages.join(', ') : messages;
            setError(formFieldName, {
              type: 'manual',
              message: errorMessage
            });
            hasSetError = true;
          }
        });
        
        if (!hasSetError) {
          toast.error(error.response?.data?.message || t("settings.saveError"));
        }
      } else {
        toast.error(error.response?.data?.message || t("settings.saveError"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    // Marcar el campo como dirty para que se detecte el cambio
    setValue("avatar", avatarUrl, { shouldDirty: true });
    setIsAvatarModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-white">
      <div className="flex flex-col items-center space-y-4">
        <button
          type="button"
          onClick={() => setIsAvatarModalOpen(true)}
          className="relative w-24 h-24 group cursor-pointer"
        >
          <Image
            src={selectedAvatar || "/placeholder-logo.png"}
            alt="User Avatar"
            width={96}
            height={96}
            className="rounded-full object-cover bg-neutral-800 transition-opacity group-hover:opacity-75"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
            <span className="text-white text-xs font-medium">{t("settings.selectAvatar")}</span>
          </div>
        </button>
        <span className="font-semibold">{userProfile?.username}</span>
      </div>

      <div className="space-y-4">
        <FormField label={t("settings.user")} name="username" control={control} errors={errors} />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-neutral-300">{t("settings.password")}</Label>
            <button
              type="button"
              onClick={() => router.push('/settings/change-password')}
              className="text-sm text-white underline hover:text-neutral-300 transition-colors"
            >
              {t("settings.changePassword")}
            </button>
          </div>
          <Input 
            type="password" 
            value="••••••••" 
            readOnly 
            className="bg-neutral-800 border-neutral-700 text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <FormSelect label={t("settings.gender")} name="gender" control={control} t={t} errors={errors} options={[
          { value: "male", label: t("gender.male") },
          { value: "female", label: t("gender.female") },
          { value: "binary", label: t("gender.binary") },
          { value: "other", label: t("gender.other") },
        ]} />
        <FormField label={`${t("settings.weight")} (lb)`} name="weight" control={control} errors={errors} type="number" />
        <FormField label={`${t("settings.height")} (ft)`} name="height" control={control} errors={errors} placeholder="e.g. 5'9" />
        <Controller
          name="birth_date"
          control={control}
          render={({ field }) => (
            <div>
              <ModernDatePicker
                label={t("settings.birthDate")}
                value={field.value}
                onChange={field.onChange}
              />
              {errors?.birth_date && (
                <p className="text-danger-600 text-sm mt-1">*{errors.birth_date.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <Button type="submit" disabled={isSaving} className="w-full bg-info-600 hover:bg-info-500 text-black font-bold">
        {isSaving ? t("common.saving") : t("settings.saveData")}
      </Button>

      {/* Avatar Selection Modal */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="bg-neutral-900 text-white border-neutral-700">
          <DialogHeader>
            <DialogTitle>{t("settings.selectAvatar")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {avatars.map((avatarUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAvatarSelect(avatarUrl)}
                className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  selectedAvatar === avatarUrl ? "border-primary-600" : "border-neutral-700"
                }`}
              >
                <Image
                  src={avatarUrl}
                  alt={`Avatar ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <h3 className="font-semibold">{t("settings.faqs")}</h3>
        <button type="button" onClick={() => router.push('/faqs')} className="w-full text-left bg-neutral-800 p-4 rounded-lg flex justify-between items-center hover:bg-neutral-700 transition-colors">
          <span>{t("settings.faqs")}</span>
          <span className="text-neutral-400">›</span>
        </button>
      </div>
      
      {/* Connections Section */}
      <div className="space-y-4">
        <h3 className="font-semibold">{t("settings.connections.title")}</h3>
        <button type="button" className="w-full text-left bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors">
          {t("settings.connections.selectDevice")}
        </button>
      </div>

      {/* Theme and Language */}
      <div className="space-y-6">
        {/* comentario-dev: <ThemeToggle /> */}
        <LanguageToggle />
      </div>

      {/* Log Out */}
      <Button variant="outline" onClick={logout} className="w-full border-danger-600 text-danger-600 hover:bg-danger-600/10 hover:text-danger-500">
        {t("settings.logOut")}
      </Button>
    </form>
  )
}

// Helper components for the form
function FormField({ label, name, control, errors, ...props }: any) {
  return (
    <div>
      <Label htmlFor={name} className="text-sm font-medium text-neutral-300">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Input 
              id={name} 
              className={`bg-neutral-800 border-neutral-700 mt-1 text-white ${errors?.[name] ? 'border-danger-600' : ''}`}
              {...field} 
              value={field.value ?? ""}
              {...props} 
            />
            {errors?.[name] && (
              <p className="text-danger-600 text-sm mt-1">*{errors[name].message}</p>
            )}
          </>
        )}
      />
    </div>
  )
}

function FormSelect({ label, name, control, options, t, errors }: any) {

  return (
    <div>
      <Label htmlFor={name} className="text-sm font-medium text-neutral-300">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          console.log(`🎯 FormSelect[${name}] - field.value:`, field.value);
          return (
            <>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                defaultValue={field.value}
              >
                <SelectTrigger className={`w-full bg-neutral-800 border-neutral-700 mt-1 text-white ${errors?.[name] ? 'border-danger-600' : ''}`}>
                  <SelectValue placeholder={t("common.selectPlaceholder")} />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 text-white border-neutral-700">
                  {options.map((option: any) => (
                    <SelectItem key={option.value} value={option.value} className="focus:bg-neutral-700">{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.[name] && (
                <p className="text-danger-600 text-sm mt-1">*{errors[name].message}</p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}

