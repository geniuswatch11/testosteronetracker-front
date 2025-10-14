import { apiRequest } from "./api-client"
import { authApi } from "./auth"
import type {
  UserProfileResponse,
  UserProfileData,
  AvatarsResponse,
  AvatarsData,
  UpdateProfileRequestData,
  UpdateProfileResponse,
  UpdateAvatarRequestData,
  UpdateAvatarResponse,
  ChangePasswordRequestData,
  ChangePasswordResponse,
} from "@/lib/types/api"

export const userApi = {
  /**
   * Obtener el perfil del usuario autenticado desde el endpoint /v1/api/users/me
   */
  getUserProfile: async (): Promise<UserProfileData> => {
    const token = authApi.getToken()
    const response = await apiRequest("http://localhost:8000/v1/api/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data: UserProfileResponse = await response.json()

    if (response.ok && data.data) {
      // Guardar el username en localStorage para acceso rápido en otras partes de la app
      if (data.data.username) {
        authApi.setUsername(data.data.username)
      }
      return data.data
    } else {
      throw new Error(data.message || "Error fetching user profile")
    }
  },

  /**
   * Obtener la lista de avatares disponibles
   */
  getAvatars: async (): Promise<string[]> => {
    const token = authApi.getToken()
    const response = await apiRequest("http://localhost:8000/v1/api/avatars/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data: AvatarsResponse = await response.json()

    if (response.ok && data.data) {
      return data.data.avatars
    } else {
      throw new Error(data.message || "Error fetching avatars")
    }
  },

  /**
   * Actualizar el perfil del usuario autenticado
   * Endpoint: POST /v1/api/me/update/
   */
  updateProfile: async (profileData: UpdateProfileRequestData): Promise<string> => {
    const token = authApi.getToken()
    const response = await apiRequest("http://localhost:8000/v1/api/me/update/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })

    const data: any = await response.json()

    if (response.ok && data.error === "") {
      return data.message
    } else {
      // Lanzar error con toda la información de respuesta para manejo correcto
      const error: any = new Error(data.message || "Error updating profile")
      error.response = {
        status: response.status,
        data: data
      }
      throw error
    }
  },

  /**
   * Actualizar el avatar del usuario autenticado
   * Endpoint: POST /v1/api/me/avatar/
   */
  updateAvatar: async (avatarUrl: string): Promise<string> => {
    const token = authApi.getToken()
    const requestData: UpdateAvatarRequestData = { avatar: avatarUrl }

    const response = await apiRequest("http://localhost:8000/v1/api/me/avatar/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    })

    const data: UpdateAvatarResponse = await response.json()

    if (response.ok && data.data) {
      return data.message
    } else {
      throw new Error(data.message || "Error updating avatar")
    }
  },

  /**
   * Cambiar la contraseña del usuario autenticado
   * Endpoint: POST /v1/api/me/change-password/
   */
  changePassword: async (passwordData: ChangePasswordRequestData): Promise<string> => {
    const token = authApi.getToken()

    const response = await apiRequest("http://localhost:8000/v1/api/me/change-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    })

    const data: any = await response.json()

    if (response.ok && data.error === "") {
      return data.message
    } else {
      // Lanzar error con toda la información de respuesta para manejo correcto
      const error: any = new Error(data.message || "Error changing password")
      error.response = {
        status: response.status,
        data: data
      }
      throw error
    }
  },
}
