"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface FAQ {
  id: number
  question: string
  answer: string
}

export default function FAQsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [openId, setOpenId] = useState<number | null>(null)

  const faqs: FAQ[] = [
    {
      id: 1,
      question: t("faqs.questions.q1"),
      answer: t("faqs.answers.a1"),
    },
    {
      id: 2,
      question: t("faqs.questions.q2"),
      answer: t("faqs.answers.a2"),
    },
    {
      id: 3,
      question: t("faqs.questions.q3"),
      answer: t("faqs.answers.a3"),
    },
    {
      id: 4,
      question: t("faqs.questions.q4"),
      answer: t("faqs.answers.a4"),
    },
    {
      id: 5,
      question: t("faqs.questions.q5"),
      answer: t("faqs.answers.a5"),
    },
    {
      id: 6,
      question: t("faqs.questions.q6"),
      answer: t("faqs.answers.a6"),
    },
    {
      id: 7,
      question: t("faqs.questions.q7"),
      answer: t("faqs.answers.a7"),
    },
  ]

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-3 p-1 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">{t("faqs.title")}</h1>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {t("faqs.description")}
        </p>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 transition-transform ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {openId === faq.id && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
