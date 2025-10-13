/**
 * Tipos TypeScript para el contrato de respuestas de la API
 * Basado en el estándar definido en las reglas del proyecto
 */

/**
 * Respuesta de éxito (No Paginada)
 * Usada para operaciones exitosas como GET (un solo recurso), POST, PATCH, DELETE
 */
export interface ApiResponse<T> {
  message: string
  error: ""
  data: T
}

/**
 * Respuesta de error
 * Usada para cualquier error controlado por la aplicación (status codes 4xx, 5xx)
 */
export interface ApiErrorResponse {
  message: string
  error: string // ej: "not_found", "validation_error", "unauthorized"
  data: null | { [key: string]: string[] } // null excepto para validation_error
}

/**
 * Respuesta paginada
 * Usada para endpoints que devuelven una lista de recursos
 */
export interface PaginatedApiResponse<T> {
  status: "success"
  data: {
    pagination: {
      next: string | null
      previous: string | null
      count: number
      current_page: number
      total_pages: number
    }
    results: T[]
  }
  message: null
}

/**
 * Tipos específicos para el endpoint de Login
 */
export interface LoginRequestData {
  email: string
  password: string
}

export interface LoginUser {
  id: string
  profile_id: string
  username: string
  spike_connect: boolean
}

export interface LoginResponseData {
  success: true
  access_token: string
  refresh_token: string
  user: LoginUser
}

export interface LoginErrorResponse {
  error: string
}

/**
 * Tipos específicos para el endpoint de Resend OTP
 */
export interface ResendOtpRequestData {
  email: string
  context: "verify" | "reset_password"
}

export interface ResendOtpResponseData {
  message: string
}

/**
 * Tipos específicos para el endpoint de Verify Account
 */
export interface VerifyAccountRequestData {
  email: string
  code: string
}

export interface VerifyAccountResponseData {
  message: string
  access_token?: string
  refresh_token?: string
}

/**
 * Tipos específicos para el endpoint de Password Reset Request
 */
export interface PasswordResetRequestData {
  email: string
}

export interface PasswordResetResponseData {
  message: string
}

/**
 * Tipos específicos para el endpoint de Password Reset Validate OTP
 */
export interface PasswordResetValidateOtpData {
  email: string
  code: string
}

export interface PasswordResetValidateOtpResponseData {
  message: string
}

/**
 * Tipos específicos para el endpoint de Password Reset Confirm
 */
export interface PasswordResetConfirmData {
  email: string
  code: string
  password: string
  confirmPassword: string
}

export interface PasswordResetConfirmResponseData {
  message: string
}

/**
 * Tipos específicos para el endpoint de Me (User Profile)
 */
export interface UserMeData {
  id: string
  username: string
  height: number | null
  weight: number | null
  language: "en" | "es"
  theme: "light" | "dark" | "system"
  avatar: string | null
  birth_date: string | null
  gender: string
  age: number | null
  is_complete: boolean
  profile_completion_percentage: number
}

export interface UserMeResponse extends ApiResponse<UserMeData> {}
