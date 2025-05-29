import { authApi } from "./auth"
import toast from "react-hot-toast"
import { translations } from "@/lib/i18n/translations"

/**
 * Utility function to handle API requests with automatic 401 handling
 */
export async function apiRequest(url: string, options?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(url, options)

    // Check if the response status is 401 (Unauthorized)
    if (response.status === 401) {
      // Get the current language from localStorage
      const currentLang = localStorage.getItem("locale") || "en"
      const lang = currentLang === "es" ? "es" : "en"

      // Show notification with translated message
      toast.error(translations[lang].common.tokenExpired)

      // Log out the user
      authApi.logout()

      // Redirect to login page
      window.location.href = "/login"

      // Throw an error to stop further processing
      throw new Error("Unauthorized: Token expired")
    }

    return response
  } catch (error) {
    // Re-throw the error to be handled by the caller
    throw error
  }
}
