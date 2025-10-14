import Cookies from "js-cookie"
import toast from "react-hot-toast"
import { apiRequest } from "./api-client"
import type { 
  ApiResponse, 
  ApiErrorResponse, 
  LoginResponseData, 
  LoginRequestData,
  ResendOtpRequestData,
  ResendOtpResponseData,
  VerifyAccountRequestData,
  VerifyAccountResponseData,
  PasswordResetRequestData,
  PasswordResetResponseData,
  PasswordResetValidateOtpData,
  PasswordResetValidateOtpResponseData,
  PasswordResetConfirmData,
  PasswordResetConfirmResponseData,
  UserProfileData
} from "@/lib/types/api"

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
  username: string
  password: string
  confirmPassword: string
  terms_and_conditions_accepted: boolean
}

export interface RegisterResponse {
  email: string
  username: string
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
export const SPIKE_CONNECT_KEY = "spike_connect"
export const IS_COMPLETE_KEY = "is_complete"
export const USERNAME_KEY = "username"

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
        
        // Guardar spike_connect en localStorage y cookies
        const spikeConnect = data.user.spike_connect ? "true" : "false"
        localStorage.setItem(SPIKE_CONNECT_KEY, spikeConnect)
        Cookies.set(SPIKE_CONNECT_KEY, spikeConnect, { expires: 1 }) // 1 día
        
        // Guardar is_complete en localStorage y cookies
        const isComplete = data.user.is_complete ? "true" : "false"
        localStorage.setItem(IS_COMPLETE_KEY, isComplete)
        Cookies.set(IS_COMPLETE_KEY, isComplete, { expires: 1 }) // 1 día
      }

      return {
        access_token: data.access_token,
        token_type: "Bearer",
        expires_in: 86400, // 1 día en segundos
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    try {
      const response = await fetch("http://localhost:8000/v1/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          username: credentials.username,
          password: credentials.password,
          confirmPassword: credentials.confirmPassword,
          terms_and_conditions_accepted: credentials.terms_and_conditions_accepted,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Manejar error con estructura: {message, error, data}
        if (responseData.error && responseData.message) {
          // Si es error de email duplicado, lanzar con información específica
          if (responseData.error === "email_already_exists") {
            throw new Error(responseData.message)
          }
          
          // Otros errores con la misma estructura
          throw new Error(responseData.message)
        }

        // Manejar errores de validación (status 422) con estructura antigua
        if (response.status === 422 && Array.isArray(responseData.detail)) {
          const errors = responseData.detail.map((err: ValidationError) => {
            const field = err.loc[1] // Obtener el nombre del campo (email, password, etc.)
            return { field, message: err.msg }
          })
          throw { validationErrors: errors }
        }

        // Otros errores
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Guardar el email para autocompletar en el login
      localStorage.setItem(REGISTER_EMAIL_KEY, responseData.email)

      return responseData
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  },

  logout: async (): Promise<void> => {
    const token = authApi.getToken()
    
    // Llamar al endpoint de logout del backend
    try {
      if (token) {
        await fetch("http://localhost:8000/v1/api/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout API error:", error)
      // Continuar con la limpieza local incluso si falla el backend
    }
    
    // Limpiar localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_PROFILE_KEY)
    localStorage.removeItem(SPIKE_CONNECT_KEY)
    localStorage.removeItem(IS_COMPLETE_KEY)
    localStorage.removeItem(USERNAME_KEY)
    localStorage.removeItem("user_id")
    localStorage.removeItem("profile_id")
    localStorage.removeItem("locale")
    localStorage.removeItem("avatars_cache")
    localStorage.removeItem("avatars_cache_timestamp")

    // Limpiar todas las cookies
    Cookies.remove(AUTH_TOKEN_KEY)
    Cookies.remove(SPIKE_CONNECT_KEY)
    Cookies.remove(IS_COMPLETE_KEY)
    Cookies.remove("locale")
  },

  isAuthenticated: (): boolean => {
    // Verificar si existe el token en localStorage o en cookies
    return !!localStorage.getItem(AUTH_TOKEN_KEY) || !!Cookies.get(AUTH_TOKEN_KEY)
  },

  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || Cookies.get(AUTH_TOKEN_KEY) || null
  },

  getSpikeConnect: (): boolean => {
    const spikeConnect = localStorage.getItem(SPIKE_CONNECT_KEY) || Cookies.get(SPIKE_CONNECT_KEY)
    return spikeConnect === "true"
  },

  getIsComplete: (): boolean => {
    const isComplete = localStorage.getItem(IS_COMPLETE_KEY) || Cookies.get(IS_COMPLETE_KEY)
    return isComplete === "true"
  },

  getCachedUserProfile: (): UserProfileData | null => {
    const profileData = localStorage.getItem(USER_PROFILE_KEY)
    return profileData ? JSON.parse(profileData) : null
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
      const response = await fetch("http://localhost:8000/v1/api/update-record", {
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
      const response = await fetch("http://localhost:8000/v1/api/update-record", {
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

  resendOtp: async (data: ResendOtpRequestData): Promise<ResendOtpResponseData> => {
    try {
      const response = await fetch("http://localhost:8000/v1/api/resend-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Manejar error con estructura: {message, error, data}
        if (responseData.error && responseData.message) {
          throw new Error(responseData.message)
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return responseData
    } catch (error) {
      console.error("Resend OTP error:", error)
      throw error
    }
  },

  verifyAccount: async (data: VerifyAccountRequestData): Promise<VerifyAccountResponseData> => {
    try {
      const response = await fetch("http://localhost:8000/v1/api/verify-account/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Manejar error con estructura: {message, error, data}
        if (responseData.error && responseData.message) {
          throw new Error(responseData.message)
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return responseData
    } catch (error) {
      console.error("Verify account error:", error)
      throw error
    }
  },

  passwordResetRequest: async (data: PasswordResetRequestData): Promise<PasswordResetResponseData> => {
    try {
      const response = await fetch("http://localhost:8000/v1/api/password-reset/request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Manejar error con estructura: {message, error, data}
        if (responseData.error && responseData.message) {
          throw new Error(responseData.message)
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return responseData
    } catch (error) {
      console.error("Password reset request error:", error)
      const errorMessage = error instanceof Error ? error.message : "Error sending password reset code"
      toast.error(errorMessage)
      throw error
    }
  },

  passwordResetValidateOtp: async (data: PasswordResetValidateOtpData): Promise<PasswordResetValidateOtpResponseData> => {
    try {
      const response = await fetch("http://localhost:8000/v1/api/password-reset/validate-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Manejar error con estructura: {message, error, data}
        if (responseData.error && responseData.message) {
          throw new Error(responseData.message)
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return responseData
    } catch (error) {
      console.error("Password reset validate OTP error:", error)
      const errorMessage = error instanceof Error ? error.message : "Invalid verification code"
      toast.error(errorMessage)
      throw error
    }
  },

  passwordResetConfirm: async (data: PasswordResetConfirmData): Promise<PasswordResetConfirmResponseData> => {
    try {
      const response = await fetch("http://localhost:8000/v1/api/password-reset/confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Manejar error con estructura: {message, error, data}
        if (responseData.error && responseData.message) {
          throw new Error(responseData.message)
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return responseData
    } catch (error) {
      console.error("Password reset confirm error:", error)
      const errorMessage = error instanceof Error ? error.message : "Error changing password"
      toast.error(errorMessage)
      throw error
    }
  },

  /**
   * Obtener el perfil del usuario autenticado desde el endpoint /v1/api/me/
   */
  getMe: async (): Promise<UserProfileData> => {
    const token = authApi.getToken()
    
    if (!token) {
      throw new Error("No authentication token found")
    }

    try {
      const response = await fetch("http://localhost:8000/v1/api/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const responseData = await response.json()

      if (!response.ok) {
        if (responseData.error && responseData.message) {
          throw new Error(responseData.message)
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Guardar el perfil en localStorage
      const profileData = responseData.data
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileData))
      
      // Guardar el username por separado para acceso rápido
      if (profileData.username) {
        localStorage.setItem(USERNAME_KEY, profileData.username)
      }

      return profileData
    } catch (error) {
      console.error("Get user profile error:", error)
      throw error
    }
  },

  /**
   * Obtener el username guardado en localStorage
   */
  getUsername: (): string | null => {
    return localStorage.getItem(USERNAME_KEY)
  },

  setUsername: (username: string) => {
    localStorage.setItem(USERNAME_KEY, username)
  },
}
