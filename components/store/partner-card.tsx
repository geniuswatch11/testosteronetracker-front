"use client"

import { useState } from "react"
import { LucideIcon } from "lucide-react"

interface PartnerCardProps {
  id: string
  icon: LucideIcon
  title: string
  description: string
  externalUrl: string
}

export function PartnerCard({ id, icon: Icon, title, description, externalUrl }: PartnerCardProps) {
  const [showModal, setShowModal] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowModal(true)
  }

  const handleBack = () => {
    setShowModal(false)
  }

  const handleContinue = () => {
    window.location.href = externalUrl
  }

  return (
    <>
      <button 
        onClick={handleClick}
        className="block group w-full text-left"
      >
        <div 
          className="relative bg-[#1C1C1E] border border-neutral-800 rounded-2xl p-6 transition-all cursor-pointer overflow-hidden h-full"
        >
          {/* Glow Effect */}
          <div className="absolute -top-1/2 -right-1/4 w-1/2 h-full bg-primary-cyan-500/10 rounded-full blur-3xl group-hover:bg-primary-cyan-500/20 transition-all duration-500" />

          <div className="relative flex gap-6 items-start">
            <Icon className="w-8 h-8 text-white flex-shrink-0 mt-1" />
            <div className="flex-1 space-y-1">
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
      </button>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-white text-xl font-medium">
                You&apos;re about to leave our app.
              </h1>
              <p className="text-neutral-400 text-sm leading-relaxed">
                You will be redirected to an external website that we do not control. There you can complete your purchase or learn more about our partner.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBack}
                className="px-8 py-3 rounded-lg bg-neutral-600 text-white font-medium hover:bg-neutral-500 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                className="px-8 py-3 rounded-lg bg-info-600 text-white font-medium hover:bg-info-500 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
