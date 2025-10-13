"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"

interface PartnerCardProps {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

export function PartnerCard({ id, icon: Icon, title, description }: PartnerCardProps) {
  return (
    <Link href={`/store/${id}`} className="block group">
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
    </Link>
  )
}
