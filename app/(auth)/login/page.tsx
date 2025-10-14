"use client"

import { Suspense } from "react"
import LoginForm from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo_2.png"
              alt="Genius Testosterone Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          
          {/* Título */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Log In Genius Testosterone</h1>
            <p className="text-sm text-muted-foreground mt-1">Good to see you.</p>
          </div>
        </div>
        
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
