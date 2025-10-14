"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Bell } from "lucide-react"
import { authApi } from "@/lib/api/auth"
import { userApi } from "@/lib/api/user"

interface PageHeaderProps {
  showNotifications?: boolean
}

/**
 * Componente reutilizable de Header con avatar, saludo y notificaciones
 * Usado en Store, Stats y otras páginas del dashboard
 */
export function PageHeader({ showNotifications = true }: PageHeaderProps) {
  const router = useRouter()
  const [username, setUsername] = useState<string>("User")
  const [avatar, setAvatar] = useState<string>("/placeholder-logo.png")
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = authApi.getUsername()
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Fetch user profile to get avatar
    const fetchUserProfile = async () => {
      try {
        const profile = await userApi.getUserProfile()
        if (profile.avatar) {
          setAvatar(profile.avatar)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()

    // Format current date
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    const formattedDate = now.toLocaleDateString("en-US", options)
    setCurrentDate(formattedDate)
  }, [])

  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-danger-600 to-primary-cyan-600 flex items-center justify-center overflow-hidden flex-shrink-0">
          <Image src={avatar} alt="Avatar" width={56} height={56} className="w-full h-full object-cover" />
        </div>

        {/* Greeting and Date */}
        <div className="space-y-1">
          <h1 className="text-white text-2xl font-bold">Hey, {username}</h1>
          <p className="text-neutral-400 text-sm">{currentDate}</p>
        </div>
      </div>

      {/* Notification Icon */}
      {showNotifications && (
        <button
          onClick={() => router.push("/notifications")}
          className="w-12 h-12 rounded-full border-2 border-neutral-600 flex items-center justify-center hover:bg-neutral-600 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  )
}
