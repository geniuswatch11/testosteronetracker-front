import type React from "react"
import BottomNav from "@/components/navigation/bottom-nav"
import AuthGuard from "@/components/auth/auth-guard"
import { ThemeInitializer } from "@/components/theme-initializer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <ThemeInitializer />
      <div className="min-h-screen bg-background text-foreground pb-16">
        {children}
        <BottomNav />
      </div>
    </AuthGuard>
  )
}
