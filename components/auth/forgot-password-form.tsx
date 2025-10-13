"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { authApi } from "@/lib/api/auth"
import { X } from "lucide-react"

export default function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setEmailError(null)
    setGeneralError(null)

    // Validación del lado del cliente
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      setIsLoading(false)
      return
    }

    try {
      await authApi.passwordResetRequest({ email })
      
      toast.success("Password reset code sent to your email!")
      // Redirigir a la página de verificación OTP con contexto de password reset
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&context=reset_password`)
    } catch (error: any) {
      // El error ya se muestra en auth.ts con toast.error
      console.error("Password reset request error:", error)
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
        <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-neutral-400 block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="your@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError(null)
              setGeneralError(null)
            }}
            className={`w-full rounded-xl bg-neutral-600 px-4 py-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
              emailError ? "ring-2 ring-danger-600" : "focus:ring-primary-600"
            }`}
          />
          {emailError && (
            <p className="text-sm text-danger-600">{emailError}</p>
          )}
        </div>

        {/* Back to Log In Link */}
        <div className="text-right">
          <Link
            href="/login"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Back to Log In
          </Link>
        </div>

        {/* Error General */}
        {generalError && (
          <div className="rounded-xl bg-danger-600/10 border border-danger-600 p-3 text-sm text-danger-600 text-center">
            {generalError}
          </div>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full rounded-full bg-primary-600 py-4 text-center text-lg font-semibold text-black transition-all hover:bg-primary-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>

        {/* Do you have an account? */}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="w-full rounded-full border-2 border-white py-4 text-center text-lg font-semibold text-white transition-all hover:bg-white hover:text-black active:scale-95"
        >
          Do you have an account?
        </button>
      </form>
    </div>
  )
}
