"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { PageHeader } from "@/components/layout/page-header"
import { PartnerCard } from "@/components/store/partner-card"
import { Heart, Activity, FlaskConical, Bed } from "lucide-react"

export default function StorePage() {
  const { t } = useLanguage()

  const partners = [
    {
      id: "vitamins",
      icon: Heart,
      title: t("store.vitamins.title"),
      description: t("store.vitamins.description"),
      externalUrl: "https://geniushormo.com/vitaminas/",
    },
    {
      id: "whoop",
      icon: Activity,
      title: t("store.whoop.title"),
      description: t("store.whoop.description"),
      externalUrl: "https://join.whoop.com/us/en/GENIUS/",
    },
    {
      id: "labs-sorio",
      icon: FlaskConical,
      title: t("store.labsSorio.title"),
      description: t("store.labsSorio.description"),
      externalUrl: "https://geniushormo.com/",
    },
    {
      id: "muse",
      icon: Bed,
      title: t("store.muse.title"),
      description: t("store.muse.description"),
      externalUrl: "https://choosemuse.com/pages/muse-2-offers",
    },
  ]

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header with Avatar, Greeting, and Notification */}
        <PageHeader />

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
                externalUrl={partner.externalUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
