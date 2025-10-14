import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { Toaster } from "react-hot-toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Genius Testosterone Tracker",
  description: "Track and monitor your testosterone usage",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-black transition-colors`}>
        <LanguageProvider>
          <Toaster position="top-center" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
