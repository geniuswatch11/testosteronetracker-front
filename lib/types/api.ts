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
 * Tipos específicos para el endpoint de User Profile (/users/me)
 */
export interface UserProfileData {
  id: string
  username: string
  email?: string // El endpoint de /me no devuelve el email, pero es útil tenerlo
  height: number | null
  weight: number | null
  language: "en" | "es"
  theme: "light" | "dark" | "system"
  avatar: string | null
  birth_date: string | null
  gender: "male" | "female" | "binary" | "other" | ""
  age: number | null
  is_complete: boolean
  profile_completion_percentage: number
}

export interface UserProfileResponse extends ApiResponse<UserProfileData> {}

/**
 * Tipos específicos para el endpoint de Avatars (/avatars)
 */
export interface AvatarsData {
  avatars: string[]
}

export interface AvatarsResponse extends ApiResponse<AvatarsData> {}

/**
 * Tipos específicos para el endpoint de Update Profile (/me/update/)
 * Todos los campos son opcionales para permitir actualizaciones parciales
 */
export interface UpdateProfileRequestData {
  username?: string
  height?: string
  weight?: string
  language?: string
  theme?: string
  birth_date?: string // formato: "YYYY-MM-DD"
  gender?: "male" | "female" | "binary" | "other"
}

export interface UpdateProfileResponseData {
  message: string
}

export interface UpdateProfileResponse extends ApiResponse<UpdateProfileResponseData> {}

/**
 * Tipos específicos para el endpoint de Update Avatar (/me/avatar/)
 */
export interface UpdateAvatarRequestData {
  avatar: string
}

export interface UpdateAvatarResponseData {
  message: string
}

export interface UpdateAvatarResponse extends ApiResponse<UpdateAvatarResponseData> {}

/**
 * Tipos específicos para el endpoint de Change Password (/me/change-password/)
 */
export interface ChangePasswordRequestData {
  password: string
  confirm_password: string
}

export interface ChangePasswordResponseData {
  message: string
}

export interface ChangePasswordResponse extends ApiResponse<ChangePasswordResponseData> {}

/**
 * Tipos específicos para el endpoint de Spike Add Device (/spike/add/)
 */
export interface SpikeAddDeviceRequestData {
  provider: string // ej: "whoop", "fitbit", etc.
}

export interface SpikeAddDeviceResponseData {
  task_id: string
  provider: string
}

export interface SpikeAddDeviceResponse extends ApiResponse<SpikeAddDeviceResponseData> {}

/**
 * Tipos específicos para el endpoint de Spike Task Status (/spike/status/:task_id/)
 */
export type SpikeTaskStatus = "PENDING" | "RETRY" | "SUCCESS" | "FAILURE"

export interface SpikeTaskStatusResponseData {
  task_id: string
  status: SpikeTaskStatus
}

export interface SpikeTaskStatusResponse extends ApiResponse<SpikeTaskStatusResponseData> {}

/**
 * Tipos específicos para el endpoint de Spike Task Results (/spike/results/:task_id/)
 */
export interface SpikeTaskResultData {
  spike_id: number
  integration_url: string
  provider: string
}

export interface SpikeTaskResultResponseData {
  task_id: string
  result: {
    message: string
    data: SpikeTaskResultData
    error: string
  }
}

export interface SpikeTaskResultResponse extends ApiResponse<SpikeTaskResultResponseData> {}

/**
 * Tipos específicos para el endpoint de Spike Consent Callback (/spike/consent-callback/)
 */
export interface SpikeConsentCallbackRequestData {
  consent_given: boolean
}

export interface SpikeConsentCallbackResponseData {
  message: string
}

export interface SpikeConsentCallbackResponse extends ApiResponse<SpikeConsentCallbackResponseData> {}

/**
 * Tipos específicos para el endpoint de Spike FAQ (/spike/faq/)
 */
export interface SpikeFaqRequestData {
  alcohol?: boolean
  drugs?: boolean
  poor_diet?: boolean
  attendance?: boolean
  others?: boolean
}

export interface SpikeFaqResponseData {
  message: string
}

export interface SpikeFaqResponse extends ApiResponse<SpikeFaqResponseData> {}
