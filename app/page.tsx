"use client"

import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black p-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md space-y-12">
        <div className="flex flex-col items-center space-y-4">
          <Logo width={150} height={150} />
        </div>

        <div className="w-full space-y-4">
          <Link href="/login" className="block w-full">
            <Button 
              className="w-full h-14 bg-primary-600 hover:bg-primary-500 text-black font-semibold rounded-lg transition-colors"
            >
              Log In
            </Button>
          </Link>

          <Link href="/register" className="block w-full">
            <Button 
              variant="outline"
              className="w-full h-14 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
