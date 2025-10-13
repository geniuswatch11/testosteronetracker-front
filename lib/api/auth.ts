import Cookies from "js-cookie"
import { apiRequest } from "./api-client"
import type { ApiResponse, ApiErrorResponse, LoginResponseData, LoginRequestData } from "@/lib/types/api"

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  name: string
  password: string
}

export interface RegisterResponse {
  email: string
  name: string
}

export interface UserProfile {
  id: number
  email: string
  avatar: string
  birth_date: string | null
  height: number | null
  weight: number | null
  theme: "white" | "dark" | "system"
  lenguaje: "en" | "es"
  has_client_id: boolean
}

export interface ErrorResponse {
  detail: string | ValidationError[]
}

export interface ValidationError {
  type: string
  loc: string[]
  msg: string
  input: any
  ctx: { error: any }
}

export const AUTH_TOKEN_KEY = "access_token"
export const REGISTER_EMAIL_KEY = "register_email"
export const USER_PROFILE_KEY = "user_profile"

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Manejar error simple: {"error": "Invalid credentials"}
        if (data.error) {
          throw new Error(data.error)
        }
        
        throw new Error("Error al iniciar sesión")
      }


      // La respuesta exitosa tiene: success, access_token, refresh_token, user
      if (!data.success || !data.access_token) {
        throw new Error("Respuesta inválida del servidor")
      }

      // Guardar el access_token en localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, data.access_token)

      // También guardar en cookie para que el middleware pueda detectarlo
      Cookies.set(AUTH_TOKEN_KEY, data.access_token, { expires: 1 }) // 1 día

      // Guardar información del usuario si es necesario
      if (data.user) {
        localStorage.setItem("user_id", data.user.id)
        localStorage.setItem("profile_id", data.user.profile_id)
      }

      return {
        access_token: data.access_token,
        token_type: "Bearer",
        expires_in: 86400, // 1 día en segundos
      }
    } catch (error) {
      console.error("Login error:", error)
      // throw error
    }
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    try {
      const response = await fetch("https://api.geniushpro.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          name: credentials.name,
          password: credentials.password,
        }),
      })

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()

        // Manejar el caso cuando el usuario ya existe (status 400)
        if (response.status === 400 && typeof errorData.detail === "string") {
          throw new Error(errorData.detail)
        }

        // Manejar errores de validación (status 422)
        if (response.status === 422 && Array.isArray(errorData.detail)) {
          const errors = errorData.detail.map((err) => {
            const field = err.loc[1] // Obtener el nombre del campo (email, password, etc.)
            return { field, message: err.msg }
          })
          throw { validationErrors: errors }
        }

        // Otros errores
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: RegisterResponse = await response.json()

      // Guardar el email para autocompletar en el login
      localStorage.setItem(REGISTER_EMAIL_KEY, data.email)

      return data
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  },

  logout: () => {
    // Eliminar el token de localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_PROFILE_KEY)

    // También eliminar de cookies
    Cookies.remove(AUTH_TOKEN_KEY)
  },

  isAuthenticated: (): boolean => {
    // Verificar si existe el token en localStorage o en cookies
    return !!localStorage.getItem(AUTH_TOKEN_KEY) || !!Cookies.get(AUTH_TOKEN_KEY)
  },

  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || Cookies.get(AUTH_TOKEN_KEY) || null
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const token = authApi.getToken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await apiRequest("https://api.geniushpro.com/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: UserProfile = await response.json()

      // Guardar el perfil en localStorage para acceso rápido
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data))

      return data
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw error
    }
  },

  getCachedUserProfile: (): UserProfile | null => {
    const profileData = localStorage.getItem(USER_PROFILE_KEY)
    return profileData ? JSON.parse(profileData) : null
  },

  isProfileComplete: (profile: UserProfile): boolean => {
    return !!profile.birth_date && !!profile.height && !!profile.weight && profile.has_client_id
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
      const response = await fetch("https://api.geniushpro.com/update-record", {
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
      const updatedProfile = {
        ...userProfile,
        has_client_id: true,
      }
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile))
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
      const response = await fetch("https://api.geniushpro.com/update-record", {
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
      const updatedProfile = {
        ...userProfile,
        has_client_id: false,
      }
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile))
    } catch (error) {
      console.error("Error disconnecting from Whoop:", error)
      throw error
    }
  },
}
