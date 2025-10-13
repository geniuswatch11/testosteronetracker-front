"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { authApi, REGISTER_EMAIL_KEY } from "@/lib/api/auth"
import { X } from "lucide-react"

interface ValidationErrors {
  [key: string]: string[]
}

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({})
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Verificar si hay un email guardado del registro
  useEffect(() => {
    const registeredEmail = localStorage.getItem(REGISTER_EMAIL_KEY)
    if (registeredEmail) {
      setEmail(registeredEmail)
      localStorage.removeItem(REGISTER_EMAIL_KEY)
    }
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setGeneralError(null)
    setFieldErrors({})

    try {
      await authApi.login({ email, password })
      toast.success("Login successful!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      
      // Manejar errores de validación de campos
      if (error.type === "validation" && error.fields) {
        setFieldErrors(error.fields)
      } else {
        // Error general
        const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión"
        setGeneralError(errorMessage)
      }
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
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-xl bg-neutral-600 px-4 py-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
              fieldErrors.email ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
            }`}
          />
          {fieldErrors.email && (
            <p className="text-sm text-danger-600">{fieldErrors.email[0]}</p>
          )}
        </div>

        {/* Campo Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-neutral-400 block">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded-xl bg-neutral-600 px-4 py-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
              fieldErrors.password ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
            }`}
          />
          {fieldErrors.password && (
            <p className="text-sm text-danger-600">{fieldErrors.password[0]}</p>
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
