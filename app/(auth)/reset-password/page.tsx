"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ResetPasswordForm from "@/components/auth/reset-password-form"
import Image from "next/image"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    const codeParam = searchParams.get("code")
    
    if (!emailParam || !codeParam) {
      // Si no hay email o código, redirigir al login
      router.push("/login")
      return
    }
    
    setEmail(emailParam)
    setCode(codeParam)
  }, [searchParams, router])

  // Mostrar loading mientras se verifican los parámetros
  if (!email || !code) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
        <div className="text-white">Loading...</div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
      <div className="w-full max-w-md space-y-16">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo_2.png"
            alt="Genius Testosterone Logo"
            width={100}
            height={100}
            priority
          />
        </div>
        
        <ResetPasswordForm email={email} code={code} />
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
        <div className="text-white">Loading...</div>
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
