"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"

interface PartnerCardProps {
  id: string
  icon: LucideIcon
  title: string
  description: string
  iconBgColor: string
}

export function PartnerCard({ id, icon: Icon, title, description, iconBgColor }: PartnerCardProps) {
  return (
    <div className="relative">
      <Link href={`/store/${id}`}>
        <div className="bg-neutral-600 rounded-2xl p-6 hover:bg-neutral-500 transition-all cursor-pointer shadow-lg shadow-black/30">
          <div className="flex gap-4">
            <div className={`${iconBgColor} rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Reflection Effect */}
      <div className="absolute top-full left-0 right-0 h-16 overflow-hidden pointer-events-none">
        <div className="bg-neutral-600 rounded-2xl p-6 opacity-10 -translate-y-full scale-y-[-1] blur-[1px]">
          <div className="flex gap-4">
            <div className={`${iconBgColor} rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
