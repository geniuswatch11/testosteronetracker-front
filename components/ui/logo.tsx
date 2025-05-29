"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export function Logo({ width = 80, height = 80, className = "" }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)

    // Detectar el tema inicial
    const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark" || ((!savedTheme || savedTheme === "system") && systemIsDark)) {
      setIsDark(true)
    }
  }, [])

  // Actualizar cuando cambie el tema
  useEffect(() => {
    if (mounted) {
      setIsDark(resolvedTheme === "dark")
    }
  }, [resolvedTheme, mounted])

  // Determinar qué logo mostrar basado en el tema
  const logoSrc = isDark
    ? "https://res.cloudinary.com/dvkudjdzf/image/upload/v1743889988/logWhite_cz7fhn.png"
    : "https://res.cloudinary.com/dvkudjdzf/image/upload/v1743889988/logDark_sbm6bb.png"

  // Mostrar un placeholder mientras se monta para evitar parpadeo
  if (!mounted) {
    return <div style={{ width, height }} className={className} />
  }

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      alt="Genius Testosterone Logo"
      width={width}
      height={height}
      className={className}
    />
  )
}
