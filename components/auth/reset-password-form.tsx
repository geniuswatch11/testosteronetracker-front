"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { authApi } from "@/lib/api/auth"
import { X, Eye, EyeOff } from "lucide-react"

interface ResetPasswordFormProps {
  email: string
  code: string
}

export default function ResetPasswordForm({ email, code }: ResetPasswordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

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
      errors.push("Must be at least 8 characters long")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Include at least one lowercase letter (a-z)")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Include at least one uppercase letter (A-Z)")
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Include at least one number (0-9)")
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Include at least one special character (e.g., !, @, #, $, %, ^, &, *)")
    }
    if (/\s/.test(password)) {
      errors.push("Should not contain spaces")
    }
    
    return errors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})
    setGeneralError(null)

    // Validación del lado del cliente
    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors.join(", ") })
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" })
      setIsLoading(false)
      return
    }

    try {
      await authApi.passwordResetConfirm({
        email,
        code,
        password,
        confirmPassword,
      })
      
      toast.success("Password changed successfully!")
      router.push("/login")
    } catch (error: any) {
      // El error ya se muestra en auth.ts con toast.error
      console.error("Password reset confirm error:", error)
      
      // Mostrar mensaje adicional en el formulario si es OTP expirado
      if (error instanceof Error) {
        if (error.message.includes("No active OTP found") || error.message.includes("OTP has expired")) {
          setGeneralError("Your verification code has expired. Please request a new one.")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-16">
      {/* Close Button (X) */}
      <button
        onClick={() => router.push("/login")}
        className="absolute top-6 left-6 text-white hover:text-neutral-400 transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Título */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">New Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Enter new password label */}
        <div className="text-left">
          <p className="text-sm text-neutral-400">Enter new password</p>
        </div>

        {/* New Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-neutral-400 block">
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors({})
                setGeneralError(null)
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
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm text-neutral-400 block">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setErrors({})
                setGeneralError(null)
              }}
              className={`w-full rounded-xl bg-neutral-600 px-4 py-3 pr-12 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
                errors.confirmPassword ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
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
        </div>

        {/* Password Requirements */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Password Requirements</p>
          <ul className="space-y-1 text-xs list-disc list-inside">
            <li className={`transition-colors duration-200 ${passwordValidations.minLength ? "text-primary-green-600" : "text-neutral-400"}`}>
              Must be at least 8 characters long
            </li>
            <li className={`transition-colors duration-200 ${passwordValidations.hasUppercase ? "text-primary-green-600" : "text-neutral-400"}`}>
              Contain at least one uppercase letter (A-Z)
            </li>
            <li className={`transition-colors duration-200 ${passwordValidations.hasLowercase ? "text-primary-green-600" : "text-neutral-400"}`}>
              Contain at least one lowercase letter (a-z)
            </li>
            <li className={`transition-colors duration-200 ${passwordValidations.hasSpecialChar ? "text-primary-green-600" : "text-neutral-400"}`}>
              Include at least one special character (e.g., !, @, #, $, %, ^, &, *)
            </li>
            <li className={`transition-colors duration-200 ${passwordValidations.hasNumber ? "text-primary-green-600" : "text-neutral-400"}`}>
              Should contain at least one number (0-9)
            </li>
          </ul>
        </div>

        {/* Error Messages */}
        {errors.password && (
          <div className="rounded-xl bg-danger-600/10 border border-danger-600 p-3 text-sm text-danger-600">
            {errors.password}
          </div>
        )}
        {errors.confirmPassword && (
          <div className="rounded-xl bg-danger-600/10 border border-danger-600 p-3 text-sm text-danger-600">
            {errors.confirmPassword}
          </div>
        )}
        {generalError && (
          <div className="rounded-xl bg-danger-600/10 border border-danger-600 p-3 text-sm text-danger-600 text-center">
            {generalError}
          </div>
        )}

        {/* Send Button - Cambia de color según validación */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className={`w-full rounded-full py-4 text-center text-lg font-semibold transition-all active:scale-95 disabled:cursor-not-allowed ${
            isFormValid
              ? "bg-primary-600 text-black hover:bg-primary-500"
              : "bg-neutral-600 text-neutral-400"
          }`}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  )
}
