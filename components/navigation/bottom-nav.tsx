"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, BarChart2, ShoppingBag, Settings } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navigation = [
    {
      name: t("dashboard.overview"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("dashboard.stats"),
      href: "/stats",
      icon: BarChart2,
    },
    {
      name: t("dashboard.store"),
      href: "/store",
      icon: ShoppingBag,
    },
    {
      name: t("dashboard.settings"),
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? "text-primary-600" : "text-muted-foreground hover:text-foreground"
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
