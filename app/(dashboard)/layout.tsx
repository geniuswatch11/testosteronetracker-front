"use client"

import type React from "react"
import BottomNav from "@/components/navigation/bottom-nav"
import AuthGuard from "@/components/auth/auth-guard"
import { ThemeInitializer } from "@/components/theme-initializer"
import DailyQuestionsModal from "@/components/dashboard/daily-questions-modal"
import { useDailyQuestions } from "@/hooks/use-daily-questions"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { shouldShow, markAsCompleted, close } = useDailyQuestions()

  return (
    <AuthGuard>
      <ThemeInitializer />
      <div className="min-h-screen bg-background text-foreground pb-16">
        {children}
        <BottomNav />
        <DailyQuestionsModal
          isOpen={shouldShow}
          onClose={close}
          onComplete={markAsCompleted}
        />
      </div>
    </AuthGuard>
  )
}
