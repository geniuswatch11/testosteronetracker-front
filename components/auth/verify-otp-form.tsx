"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { authApi } from "@/lib/api/auth"
import { X } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"

interface VerifyOtpFormProps {
  email: string
  context?: "verify" | "reset_password"
}

export default function VerifyOtpForm({ email, context = "verify" }: VerifyOtpFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const MAX_ATTEMPTS = 5

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setGeneralError("Please enter the complete 6-digit code")
      return
    }
    
    if (attempts >= MAX_ATTEMPTS) {
      setGeneralError("You have exceeded the maximum number of attempts. Please request a new code.")
      return
    }

    setIsLoading(true)
    setGeneralError(null)

    try {
      if (context === "reset_password") {
        // Validar OTP para reset de contraseña
        await authApi.passwordResetValidateOtp({
          email,
          code: otpCode,
        })

        toast.success("Code verified successfully!")
        // Redirigir a la página de reset-password con email y código
        router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${otpCode}`)
      } else {
        // Verificar cuenta (flujo de registro)
        await authApi.verifyAccount({
          email,
          code: otpCode,
        })

        toast.success("Account verified successfully!")
        setShowSuccess(true)
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error)
      
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      const errorMessage = error instanceof Error ? error.message : "Invalid verification code"
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setGeneralError("You have exceeded the maximum number of attempts. Please request a new code.")
      } else {
        setGeneralError(`${errorMessage}. Attempts remaining: ${MAX_ATTEMPTS - newAttempts}`)
      }
      
      // Limpiar el código para permitir un nuevo intento
      setOtpCode("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setGeneralError(null)
    setAttempts(0) // Resetear intentos al reenviar código
    setOtpCode("")

    try {
      await authApi.resendOtp({
        email,
        context,
      })

      toast.success("Verification code sent successfully!")
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      const errorMessage = error instanceof Error ? error.message : "Error sending verification code"
      setGeneralError(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  // Pantalla de éxito
  if (showSuccess) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        {/* Card de éxito */}
        <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-neutral-600/40 to-neutral-600/20 backdrop-blur-sm p-12 space-y-6 text-center">
          {/* Checkmark Icon */}
          <div className="flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* Círculo exterior amarillo */}
              <div className="absolute inset-0 rounded-full border-4 border-primary-600"></div>
              {/* Círculo interior gris oscuro */}
              <div className="absolute inset-2 rounded-full bg-neutral-600"></div>
              {/* Checkmark */}
              <svg
                className="relative z-10 h-10 w-10 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          
          {/* Texto */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">You're ready to go</h2>
            <p className="text-sm text-neutral-400">Email successfully verified.</p>
            <p className="text-sm text-neutral-400">You're all set to continue.</p>
          </div>
        </div>
        
        {/* Continue Button - Fuera del card */}
        <div className="w-full max-w-sm mt-8">
          <button
            onClick={() => router.push(`/login?email=${encodeURIComponent(email)}`)}
            className="w-full rounded-full bg-primary-600 py-4 text-center text-lg font-semibold text-black transition-all hover:bg-primary-500 active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    )
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
        <h2 className="text-2xl font-bold text-white">Enter verification Code</h2>
      </div>

      {/* OTP Input con separadores */}
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otpCode}
          onChange={(value) => {
            setOtpCode(value)
            setGeneralError(null)
          }}
          disabled={isLoading || attempts >= MAX_ATTEMPTS}
        >
          <InputOTPGroup className="gap-2">
            <InputOTPSlot 
              index={0} 
              className="h-14 w-14 rounded-xl bg-neutral-600 text-white text-xl font-semibold border-0 focus:ring-2 focus:ring-primary-600"
            />
            <span className="text-neutral-400 text-xl pb-1">-</span>
            <InputOTPSlot 
              index={1} 
              className="h-14 w-14 rounded-xl bg-neutral-600 text-white text-xl font-semibold border-0 focus:ring-2 focus:ring-primary-600"
            />
            <span className="text-neutral-400 text-xl pb-1">-</span>
            <InputOTPSlot 
              index={2} 
              className="h-14 w-14 rounded-xl bg-neutral-600 text-white text-xl font-semibold border-0 focus:ring-2 focus:ring-primary-600"
            />
            <span className="text-neutral-400 text-xl pb-1">-</span>
            <InputOTPSlot 
              index={3} 
              className="h-14 w-14 rounded-xl bg-neutral-600 text-white text-xl font-semibold border-0 focus:ring-2 focus:ring-primary-600"
            />
            <span className="text-neutral-400 text-xl pb-1">-</span>
            <InputOTPSlot 
              index={4} 
              className="h-14 w-14 rounded-xl bg-neutral-600 text-white text-xl font-semibold border-0 focus:ring-2 focus:ring-primary-600"
            />
            <span className="text-neutral-400 text-xl pb-1">-</span>
            <InputOTPSlot 
              index={5} 
              className="h-14 w-14 rounded-xl bg-neutral-600 text-white text-xl font-semibold border-0 focus:ring-2 focus:ring-primary-600"
            />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Resend Link */}
      <div className="text-center -mt-4">
        <p className="text-sm text-neutral-400">
          If you didn't receive a code,{" "}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="text-primary-600 font-semibold hover:text-primary-500 transition-colors disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend"}
          </button>
        </p>
      </div>

      {/* Error Message */}
      {generalError && (
        <div className="rounded-xl bg-danger-600/10 border border-danger-600 p-3 text-sm text-danger-600 text-center -mt-8">
          {generalError}
        </div>
      )}

      {/* Spacer para mantener consistencia */}
      <div className="space-y-4">
        {/* Send Button */}
        <button
          onClick={handleVerifyOtp}
          disabled={isLoading || otpCode.length !== 6 || attempts >= MAX_ATTEMPTS}
          className="w-full rounded-full bg-primary-600 py-4 text-center text-lg font-semibold text-black transition-all hover:bg-primary-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Send"}
        </button>

        {/* Do you have an account? */}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full rounded-full border-2 border-white py-4 text-center text-lg font-semibold text-white transition-all hover:bg-white hover:text-black active:scale-95"
        >
          Do you have an account?
        </button>
      </div>
    </div>
  )
}
