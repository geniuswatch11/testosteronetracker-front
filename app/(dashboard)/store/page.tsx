"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { PartnerCard } from "@/components/store/partner-card"
import { Heart, Activity, FlaskConical, Brain, Bell, Bed } from "lucide-react"
import { authApi } from "@/lib/api/auth"
import Image from "next/image"

export default function StorePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [username, setUsername] = useState<string>("User")
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = authApi.getUsername()
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Format current date
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }
    const formattedDate = now.toLocaleDateString('en-US', options)
    setCurrentDate(formattedDate)
  }, [])

  const partners = [
    {
      id: "vitamins",
      icon: Heart,
      title: t("store.vitamins.title"),
      description: t("store.vitamins.description"),
      externalUrl: "https://www.google.com",
    },
    {
      id: "whoop",
      icon: Activity,
      title: t("store.whoop.title"),
      description: t("store.whoop.description"),
      externalUrl: "https://www.google.com",
    },
    {
      id: "labs-sorio",
      icon: FlaskConical,
      title: t("store.labsSorio.title"),
      description: t("store.labsSorio.description"),
      externalUrl: "https://www.google.com",
    },
    {
      id: "muse",
      icon: Bed,
      title: t("store.muse.title"),
      description: t("store.muse.description"),
      externalUrl: "https://www.google.com",
    },
  ]

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header with Avatar, Greeting, and Notification */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-danger-600 to-primary-cyan-600 flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src="/placeholder-logo.png"
                alt="Avatar"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Greeting and Date */}
            <div className="space-y-1">
              <h1 className="text-white text-2xl font-bold">
                Hey, {username}
              </h1>
              <p className="text-neutral-400 text-sm">
                {currentDate}
              </p>
            </div>
          </div>
          
          {/* Notification Icon */}
          <button
            onClick={() => router.push("/coming-soon")}
            className="w-12 h-12 rounded-full border-2 border-neutral-600 flex items-center justify-center hover:bg-neutral-600 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Store Section */}
        <div className="space-y-6">
          {/* Store Title and Subtitle */}
          <div className="space-y-2">
            <h2 className="text-white text-2xl font-bold">{t("store.title")}</h2>
            <p className="text-neutral-400 text-sm">{t("store.subtitle")}</p>
          </div>

          {/* Partners List */}
          <div className="space-y-6">
            {partners.map((partner) => (
              <PartnerCard
                key={partner.id}
                id={partner.id}
                icon={partner.icon}
                title={partner.title}
                description={partner.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
