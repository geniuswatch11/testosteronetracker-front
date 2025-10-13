"use client"

import LoginForm from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
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
            <h1 className="text-2xl font-bold text-white">Log In Genius Testosterone</h1>
            <p className="text-sm text-neutral-400 mt-1">Good to see you.</p>
          </div>
        </div>
        
        <LoginForm />
      </div>
    </main>
  )
}
