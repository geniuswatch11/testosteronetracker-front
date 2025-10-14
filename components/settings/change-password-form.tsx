"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { userApi } from "@/lib/api/user"
import { useLanguage } from "@/lib/i18n/language-context"
import type { ChangePasswordRequestData } from "@/lib/types/api"

export default function ChangePasswordForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Validar si el botón debe estar activo (amarillo)
  const isFormValid = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword

  // Validaciones individuales de contraseña en tiempo real
  const passwordValidations = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noSpaces: password.length > 0 ? !/\s/.test(password) : false,
  }

  // Validaciones de contraseña para el submit
  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push(t("changePassword.validations.minLength"))
    }
    if (!/[a-z]/.test(password)) {
      errors.push(t("changePassword.validations.hasLowercase"))
    }
    if (!/[A-Z]/.test(password)) {
      errors.push(t("changePassword.validations.hasUppercase"))
    }
    if (!/[0-9]/.test(password)) {
      errors.push(t("changePassword.validations.hasNumber"))
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push(t("changePassword.validations.hasSpecialChar"))
    }
    if (/\s/.test(password)) {
      errors.push(t("changePassword.validations.noSpaces"))
    }
    
    return errors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validación del lado del cliente
    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors.join(", ") })
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrors({ confirm_password: t("changePassword.passwordMismatch") })
      setIsLoading(false)
      return
    }

    try {
      const requestData: ChangePasswordRequestData = {
        password,
        confirm_password: confirmPassword,
      }
      
      await userApi.changePassword(requestData)
      
      // Redirigir a la página de éxito
      router.push("/settings/change-password/success")
    } catch (error: any) {
      console.error("Change password error:", error)
      
      // Manejar errores de validación según el contrato de API
      if (error.response?.data?.error === "validation_error" && error.response?.data?.data) {
        const validationErrors = error.response.data.data
        const newErrors: { [key: string]: string } = {}
        
        Object.entries(validationErrors).forEach(([field, messages]: [string, any]) => {
          const errorMessage = Array.isArray(messages) ? messages.join(", ") : messages
          newErrors[field] = errorMessage
        })
        
        setErrors(newErrors)
      } else {
        // Error general
        setErrors({ general: error.response?.data?.message || t("changePassword.error") })
      }
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-neutral-400 block">
            {t("changePassword.password")}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("changePassword.passwordPlaceholder")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors({})
              }}
              className={`w-full rounded-xl bg-neutral-600 px-4 py-3 pr-12 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
                errors.password ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-danger-600 text-sm mt-1">*{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm text-neutral-400 block">
            {t("changePassword.confirmPassword")}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("changePassword.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setErrors({})
              }}
              className={`w-full rounded-xl bg-neutral-600 px-4 py-3 pr-12 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
                errors.confirm_password ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-danger-600 text-sm mt-1">*{errors.confirm_password}</p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">{t("changePassword.requirements")}</p>
          <ul className="space-y-1 text-xs list-disc list-inside">
            <li className={`transition-colors duration-200 ${passwordValidations.minLength ? "text-primary-600" : "text-neutral-400"}`}>
              {t("changePassword.validations.minLength")}
            </li>
            <li className={`transition-colors duration-200 ${passwordValidations.hasUppercase ? "text-primary-600" : "text-neutral-400"}`}>
              {t("changePassword.validations.hasUppercase")}
            </li>
            <li className={`transition-colors duration-200 ${passwordValidations.hasNumber ? "text-primary-600" : "text-neutral-400"}`}>
              {t("changePassword.validations.hasNumber")}
            </li>
            <li className={`transition-colors duration-200 ${passwordValidations.hasSpecialChar ? "text-primary-600" : "text-neutral-400"}`}>
              {t("changePassword.validations.hasSpecialChar")}
            </li>
            <li className={`transition-colors duration-200 ${passwordValidations.noSpaces ? "text-primary-600" : "text-neutral-400"}`}>
              {t("changePassword.validations.noSpaces")}
            </li>
          </ul>
        </div>

        {/* Error General */}
        {errors.general && (
          <div className="rounded-xl bg-danger-600/10 border border-danger-600 p-3 text-sm text-danger-600 text-center">
            {errors.general}
          </div>
        )}

        {/* Change Button - Cambia de color según validación */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className={`w-full rounded-full py-4 text-center text-lg font-semibold transition-all active:scale-95 disabled:cursor-not-allowed ${
            isFormValid
              ? "bg-primary-600 text-black hover:bg-primary-500"
              : "bg-neutral-600 text-neutral-400"
          }`}
        >
          {isLoading ? t("common.saving") : t("changePassword.change")}
        </button>
      </form>

    </>
  )
}
