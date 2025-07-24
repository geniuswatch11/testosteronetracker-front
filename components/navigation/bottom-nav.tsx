"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart2, Bell, Settings } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navigation = [
    {
      name: t("dashboard.overview"),
      href: "/dashboard",
      icon: BarChart2,
    },
    {
      name: t("dashboard.notifications"),
      href: "/notifications",
      icon: Bell,
    },
    {
      name: t("dashboard.settings"),
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 ${
                isActive ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
