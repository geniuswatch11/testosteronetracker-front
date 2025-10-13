"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { authApi } from "@/lib/api/auth"
import { X, Eye, EyeOff } from "lucide-react"
import TermsModal from "./terms-modal"

interface ValidationError {
  field: string
  message: string
}

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  
  // Form fields
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  
  // Modal state
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Button enabled state
  const [isFormValid, setIsFormValid] = useState(false)

  // Validate form on field changes
  useEffect(() => {
    const isValid = 
      username.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      password === confirmPassword &&
      acceptedTerms
    
    setIsFormValid(isValid)
  }, [username, email, password, confirmPassword, acceptedTerms])

  // Validate password requirements
  const validatePassword = (pwd: string) => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    }
    return requirements
  }

  const passwordRequirements = validatePassword(password)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    if (!isFormValid) return
    
    setIsLoading(true)
    setErrors({})
    setGeneralError(null)

    // Client-side validation
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" })
      setIsLoading(false)
      return
    }

    try {
      await authApi.register({
        email,
        username,
        password,
        confirmPassword,
        terms_and_conditions_accepted: acceptedTerms,
      })

      toast.success("Registration successful! Please verify your email.")
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      console.error("Register error:", error)

      // Handle validation errors
      if (error.validationErrors) {
        const newErrors: { [key: string]: string } = {}
        error.validationErrors.forEach((err: ValidationError) => {
          newErrors[err.field] = err.message
        })
        setErrors(newErrors)
      } else if (error.message) {
        setGeneralError(error.message)
        if (error.message.includes("already exists") || error.message.includes("ya existe")) {
          setErrors({ email: error.message })
        }
      } else {
        setGeneralError("Registration error. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Username Field */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm text-neutral-400 block">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full rounded-xl bg-neutral-600 px-4 py-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
              errors.username ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
            }`}
          />
          {errors.username && (
            <p className="text-sm text-danger-600">{errors.username}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-neutral-400 block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-xl bg-neutral-600 px-4 py-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
              errors.email ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-danger-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-neutral-400 block">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                // Si confirmPassword ya tiene valor, limpiar error si ahora coinciden
                if (confirmPassword && errors.confirmPassword && e.target.value === confirmPassword) {
                  const newErrors = { ...errors }
                  delete newErrors.confirmPassword
                  setErrors(newErrors)
                }
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
            <p className="text-sm text-danger-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm text-neutral-400 block">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => {
                // Validar cuando el usuario sale del campo
                if (confirmPassword && password && confirmPassword !== password) {
                  setErrors({ ...errors, confirmPassword: "Passwords do not match" })
                } else if (errors.confirmPassword) {
                  // Limpiar el error si ahora coinciden
                  const newErrors = { ...errors }
                  delete newErrors.confirmPassword
                  setErrors(newErrors)
                }
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
          {errors.confirmPassword && (
            <p className="text-sm text-danger-600">{errors.confirmPassword}</p>
          )}
          {/* Mostrar error si las contraseñas no coinciden y ambos campos tienen valor */}
          {!errors.confirmPassword && confirmPassword && password && confirmPassword !== password && (
            <p className="text-sm text-danger-600">Passwords do not match</p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-400 font-medium">Password Requirements</p>
          <ul className="space-y-1 text-xs text-neutral-400">
            <li className={passwordRequirements.length ? "text-primary-600" : ""}>
              • Must be at least 8 characters long
            </li>
            <li className={passwordRequirements.uppercase ? "text-primary-600" : ""}>
              • Contain at least one uppercase letter (A-Z)
            </li>
            <li className={passwordRequirements.lowercase ? "text-primary-600" : ""}>
              • Contain at least one lowercase letter (a-z)
            </li>
            <li className={passwordRequirements.special ? "text-primary-600" : ""}>
              • Include at least one special character (e.g., ! @ # $ % ^ & *)
            </li>
            <li className={passwordRequirements.number ? "text-primary-600" : ""}>
              • Should contain at least one number (0-9)
            </li>
          </ul>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-start space-x-3">
          <input
            id="terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-neutral-400 bg-neutral-600 text-primary-600 focus:ring-2 focus:ring-primary-600"
          />
          <label htmlFor="terms" className="text-sm text-neutral-400">
            Accept{" "}
            <button
              type="button"
              onClick={() => setIsTermsModalOpen(true)}
              className="text-white underline hover:text-primary-600 transition-colors"
            >
              Terms and Conditions
            </button>{" "}
            to continue
          </label>
        </div>

        {/* General Error */}
        {generalError && (
          <div className="rounded-xl bg-danger-600/10 border border-danger-600 p-3 text-sm text-danger-600">
            {generalError}
          </div>
        )}

        {/* Register Button */}
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full rounded-full py-4 text-center text-lg font-semibold transition-all active:scale-95 ${
            isFormValid && !isLoading
              ? "bg-primary-600 text-black hover:bg-primary-500 cursor-pointer"
              : "bg-neutral-500 text-neutral-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Loading..." : "Register"}
        </button>
      </form>

      {/* Close Button (X) */}
      <button
        onClick={() => router.push("/login")}
        className="absolute top-6 left-6 text-white hover:text-neutral-400 transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => setAcceptedTerms(true)}
      />
    </div>
  )
}
