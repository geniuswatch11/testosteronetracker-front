"use client"

import type React from "react"
import BottomNav from "@/components/navigation/bottom-nav"
import AuthGuard from "@/components/auth/auth-guard"
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
      <div className="min-h-screen bg-black text-white pb-16">
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
