"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import VerifyOtpForm from "@/components/auth/verify-otp-form"
import Image from "next/image"

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    
    if (!emailParam) {
      // Si no hay email en los parámetros, redirigir al registro
      router.push("/register")
      return
    }
    
    setEmail(emailParam)
  }, [searchParams, router])

  // Mostrar loading mientras se verifica el email
  if (!email) {
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
        
        <VerifyOtpForm email={email} />
      </div>
    </main>
  )
}
