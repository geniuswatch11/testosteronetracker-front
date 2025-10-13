"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { X } from "lucide-react"

export default function ComingSoonPage() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 text-center">
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

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Coming Soon</h1>
          <p className="text-lg text-neutral-400">
            This feature is currently under development.
          </p>
          <p className="text-sm text-neutral-500">
            We're working hard to bring you the best experience. Check back soon!
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="w-full rounded-full bg-primary-600 py-4 text-center text-lg font-semibold text-black transition-all hover:bg-primary-500 active:scale-95"
        >
          Go Back
        </button>

        {/* Close Button (X) */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 text-white hover:text-neutral-400 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </main>
  )
}
