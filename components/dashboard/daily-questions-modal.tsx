"use client"

import { useState } from "react"
import { X, Check, ChevronLeft } from "lucide-react"
import { spikeApi } from "@/lib/api/spike"
import { useLanguage } from "@/lib/i18n/language-context"
import toast from "react-hot-toast"
import { ChoiceButton } from "./choice-button"

interface DailyQuestionsModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

interface QuestionState {
  alcohol: boolean | null
  drugs: boolean | null
  poor_diet: boolean | null
  attendance: boolean | null
  others: boolean | null
}

export default function DailyQuestionsModal({
  isOpen,
  onClose,
  onComplete,
}: DailyQuestionsModalProps) {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState(false)
  const [answers, setAnswers] = useState<QuestionState>({
    alcohol: null,
    drugs: null,
    poor_diet: null,
    attendance: null,
    others: null,
  })

  if (!isOpen) return null

  const setAnswer = (key: keyof QuestionState, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const answeredQuestions = Object.fromEntries(
        Object.entries(answers).filter(([, value]) => value !== null)
      ) as Partial<Record<keyof QuestionState, boolean>>

      if (Object.keys(answeredQuestions).length === 0) {
        onClose() // Cierra el modal si no se respondió nada
        return
      }

      await spikeApi.submitFaq(answeredQuestions)
      toast.success(t("dailyQuestions.saved"))
      onComplete()
    } catch (error) {
      console.error("Error saving daily questions:", error)
      toast.error(t("dailyQuestions.error"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem("dailyQuestions_skipped", today)
    onClose()
  }

  const questions: Array<{ key: keyof QuestionState; title: string; description: string }> = [
    {
      key: "alcohol",
      title: t("dailyQuestions.alcohol.title"),
      description: t("dailyQuestions.alcohol.description"),
    },
    {
      key: "drugs",
      title: t("dailyQuestions.drugs.title"),
      description: t("dailyQuestions.drugs.description"),
    },
    {
      key: "poor_diet",
      title: t("dailyQuestions.poorDiet.title"),
      description: t("dailyQuestions.poorDiet.description"),
    },
    {
      key: "attendance",
      title: t("dailyQuestions.attendance.title"),
      description: t("dailyQuestions.attendance.description"),
    },
    // Ocultamos la pregunta 'others' por ahora para coincidir con la maqueta
    // {
    //   key: "others",
    //   title: t("dailyQuestions.others.title"),
    //   description: t("dailyQuestions.others.description"),
    // },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#5a6b4a] via-[#3d4a35] to-[#2a3328] rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-center relative px-6 py-5 border-b border-white/10">
          <button
            onClick={handleCancel}
            className="text-white/80 hover:text-white transition-colors absolute left-4"
            aria-label={t("common.back")}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold text-white">{t("dailyQuestions.title")}</h2>
        </header>

        {/* Questions List */}
        <main className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {questions.map((question) => (
              <div key={question.key} className="flex items-start justify-between gap-3 py-2">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm leading-tight">
                    {question.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-0.5 leading-tight">
                    {question.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setAnswer(question.key, true)}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                      answers[question.key] === true
                        ? "bg-white text-black"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                    aria-label="Yes"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setAnswer(question.key, false)}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                      answers[question.key] === false
                        ? "bg-white text-black"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                    aria-label="No"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Save Button */}
        <div className="flex-shrink-0 px-6 py-5">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[#a8b88a] hover:bg-[#b5c599] text-black font-semibold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSaving ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </div>
    </div>
  )
}
