"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { authApi, REGISTER_EMAIL_KEY } from "@/lib/api/auth"
import { X, Eye, EyeOff } from "lucide-react"

interface ValidationErrors {
  [key: string]: string[]
}

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Verificar si hay un email en query params o guardado del registro
  useEffect(() => {
    const emailParam = searchParams.get("email")
    const registeredEmail = localStorage.getItem(REGISTER_EMAIL_KEY)
    
    if (emailParam) {
      setEmail(emailParam)
    } else if (registeredEmail) {
      setEmail(registeredEmail)
      localStorage.removeItem(REGISTER_EMAIL_KEY)
    }
  }, [searchParams])

  // Validación de email
  const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Email is required"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address"
    }
    return null
  }

  // Validación de password
  const validatePassword = (password: string): string | null => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters"
    }
    return null
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setGeneralError(null)
    setFieldErrors({})

    // Validación del lado del cliente
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      const errors: { [key: string]: string } = {}
      if (emailError) errors.email = emailError
      if (passwordError) errors.password = passwordError
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      await authApi.login({ email, password })
      
      // Fetch user profile from /v1/api/me/ and store username
      try {
        await authApi.getMe()
      } catch (profileError) {
        // Log the error but don't block login
        console.error("Error fetching user profile:", profileError)
      }
      
      toast.success("Login successful!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      
      // Error general
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión"
      setGeneralError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Campo Email */}
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
            onChange={(e) => {
              setEmail(e.target.value)
              // Limpiar error al escribir
              if (fieldErrors.email) {
                setFieldErrors({ ...fieldErrors, email: "" })
              }
            }}
            className={`w-full rounded-xl bg-neutral-600 px-4 py-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
              fieldErrors.email ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
            }`}
          />
          {fieldErrors.email && (
            <p className="text-sm text-danger-600">{fieldErrors.email}</p>
          )}
        </div>

        {/* Campo Password */}
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
                // Limpiar error al escribir
                if (fieldErrors.password) {
                  setFieldErrors({ ...fieldErrors, password: "" })
                }
              }}
              className={`w-full rounded-xl bg-neutral-600 px-4 py-3 pr-12 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
                fieldErrors.password ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
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
          {fieldErrors.password && (
            <p className="text-sm text-danger-600">{fieldErrors.password}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Error General */}
        {generalError && (
          <div className="rounded-xl bg-danger-600/10 border border-danger-600 p-3 text-sm text-danger-600">
            {generalError}
          </div>
        )}

        {/* Botón Log In con efecto visual */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-primary-600 py-4 text-center text-lg font-semibold text-black transition-all hover:bg-primary-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Log In"}
        </button>
      </form>

      {/* Botón Register */}
      <Link
        href="/register"
        className="block w-full rounded-full border-2 border-white py-4 text-center text-lg font-semibold text-white transition-all hover:bg-white hover:text-black active:scale-95"
      >
        Register
      </Link>

      {/* Botón de cerrar (X) */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 text-white hover:text-neutral-400 transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  )
}
