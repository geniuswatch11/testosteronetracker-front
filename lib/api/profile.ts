import { authApi } from "./auth"
import { apiRequest } from "./api-client"

export interface PersonalData {
  weight: number
  height: number
  birthDate: string
}

export const profileApi = {
  updatePersonalData: async (data: PersonalData): Promise<void> => {
    const token = authApi.getToken()
    const userProfile = authApi.getCachedUserProfile()

    if (!token) {
      throw new Error("No authentication token found")
    }

    if (!userProfile || !userProfile.id) {
      throw new Error("User profile or ID not found")
    }

    try {
      const response = await apiRequest("https://api.geniushpro.com/update-record", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          table: "users",
          data: {
            birth_date: data.birthDate,
            height: data.height,
            weight: data.weight,
          },
          where: {
            id: userProfile.id,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Update the profile in localStorage
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          weight: data.weight,
          height: data.height,
          birth_date: data.birthDate,
        }
        localStorage.setItem("user_profile", JSON.stringify(updatedProfile))
      }

      // Wait a bit to simulate response time
      await new Promise((resolve) => setTimeout(resolve, 800))
    } catch (error) {
      console.error("Error updating personal data:", error)
      throw error
    }
  },

  connectWhoop: async (): Promise<void> => {
    const token = authApi.getToken()
    const userProfile = authApi.getCachedUserProfile()

    if (!token) {
      throw new Error("No authentication token found")
    }

    if (!userProfile || !userProfile.id) {
      throw new Error("User profile or ID not found")
    }

    try {
      const response = await apiRequest("https://api.geniushpro.com/update-record", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          table: "users",
          data: {
            has_client_id: true,
          },
          where: {
            id: userProfile.id,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Update the profile in localStorage
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          has_client_id: true,
        }
        localStorage.setItem("user_profile", JSON.stringify(updatedProfile))
      }

      // Wait a bit to simulate response time
      await new Promise((resolve) => setTimeout(resolve, 800))
    } catch (error) {
      console.error("Error connecting to Whoop:", error)
      throw error
    }
  },

  disconnectWhoop: async (): Promise<void> => {
    const token = authApi.getToken()
    const userProfile = authApi.getCachedUserProfile()

    if (!token) {
      throw new Error("No authentication token found")
    }

    if (!userProfile || !userProfile.id) {
      throw new Error("User profile or ID not found")
    }

    try {
      const response = await apiRequest("https://api.geniushpro.com/update-record", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          table: "users",
          data: {
            has_client_id: false,
          },
          where: {
            id: userProfile.id,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Update the profile in localStorage
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          has_client_id: false,
        }
        localStorage.setItem("user_profile", JSON.stringify(updatedProfile))
      }

      // Wait a bit to simulate response time
      await new Promise((resolve) => setTimeout(resolve, 800))
    } catch (error) {
      console.error("Error disconnecting from Whoop:", error)
      throw error
    }
  },
}
