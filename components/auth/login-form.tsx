"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { authApi, REGISTER_EMAIL_KEY } from "@/lib/api/auth"
import { useLanguage } from "@/lib/i18n/language-context"

export default function LoginForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")

  // Verificar si hay un email guardado del registro
  useEffect(() => {
    const registeredEmail = localStorage.getItem(REGISTER_EMAIL_KEY)
    if (registeredEmail) {
      setEmail(registeredEmail)
      // Limpiar el email guardado después de usarlo
      localStorage.removeItem(REGISTER_EMAIL_KEY)
    }
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await authApi.login({ email, password })
      toast.success(t("auth.loginSuccess"))

      // Usar router.push para navegación del lado del cliente
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : t("auth.loginError"))
      toast.error(error instanceof Error ? error.message : t("auth.loginError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input
            name="email"
            type="email"
            placeholder={t("auth.email")}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder={t("auth.password")}
            required
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full border border-black px-4 py-2 text-center font-semibold transition-colors hover:bg-black hover:text-white disabled:opacity-50 dark:border-white dark:hover:bg-white dark:hover:text-black"
        >
          {isLoading ? t("common.loading") : t("auth.login")}
        </button>
      </form>
      <Link
        href="/register"
        className="block w-full rounded-full border border-black px-4 py-2 text-center font-semibold transition-colors hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
      >
        {t("auth.register")}
      </Link>
    </div>
  )
}
