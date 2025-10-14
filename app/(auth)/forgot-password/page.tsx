"use client"

import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import Image from "next/image"

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
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
        
        <ForgotPasswordForm />
      </div>
    </main>
  )
}

// Componente ComingSoon guardado para futuras funcionalidades
// import { ComingSoon } from "@/components/ui/coming-soon"
// <ComingSoon
//   title="Coming soon"
//   description="Functionality will be available in future versions of the application"
//   buttonText="Continue"
// />
