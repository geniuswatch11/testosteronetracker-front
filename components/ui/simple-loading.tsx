"use client"

import Image from "next/image"

export function SimpleLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="animate-pulse">
        <div className="w-32 h-32 flex items-center justify-center">
          <Image
            src="/logo_2.png"
            alt="Loading"
            width={128}
            height={128}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
