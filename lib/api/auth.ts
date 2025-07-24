import Cookies from "js-cookie";
import { apiRequest } from "./api-client";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  firstName: string;
  lastName?: string; // Optional, assuming it's the same as name
  confirmPassword?: string; // Optional, assuming it's the same as password
  password: string;
}

export interface RegisterResponse {
  email: string;
  name: string;
}

export interface UserProfile {
  id: number;
  email: string;
  avatar: string;
  birth_date: string | null;
  height: number | null;
  weight: number | null;
  theme: "white" | "dark" | "system";
  lenguaje: "en" | "es";
  has_client_id: boolean;
  profile_completion_percentage: number; // Percentage of profile completion
}

export interface ErrorResponse {
  detail: string | ValidationError[];
}

export interface ValidationError {
  type: string;
  loc: string[];
  msg: string;
  input: any;
  ctx: { error: any };
}

export const AUTH_TOKEN_KEY = "access_token";
export const REGISTER_EMAIL_KEY = "register_email";
export const USER_PROFILE_KEY = "user_profile";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiRequest<any>("/login/", {
        method: "POST",
        data: {
          email: credentials.email,
          password: credentials.password,
        },
      });

      const data = response;
      console.log("Login response:", data);
      if (!data || !data.access_token) {
        console.error("Login response missing access_token:", data);
        throw new Error(
          "La respuesta del servidor no contiene access_token. Verifica la estructura de la respuesta."
        );
      }
      localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
      Cookies.set(AUTH_TOKEN_KEY, data.access_token, { expires: 1 }); // 1 día
      return data;
    } catch (error: any) {
      // Axios error
      if (error.response && error.response.data) {
        const errorData: ErrorResponse = error.response.data;
        if (error.response.status === 401) {
          throw new Error(
            typeof errorData.detail === "string"
              ? errorData.detail
              : "Credenciales inválidas"
          );
        }
        throw new Error(
          typeof errorData.detail === "string"
            ? errorData.detail
            : `Error ${error.response.status}`
        );
      }
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<RegisterResponse> => {
    try {
      const response = await apiRequest<any>("/register/", {
        method: "POST",
        data: {
          email: credentials.email,
          first_name: credentials.firstName,
          password: credentials.password,
          confirmPassword: credentials.password,
          last_name: credentials.lastName,
        },
      });

      const data = response.data;

      // Guardar el email para autocompletar en el login
      localStorage.setItem(REGISTER_EMAIL_KEY, data.email);

      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData: ErrorResponse = error.response.data;
        // Manejar el caso cuando el usuario ya existe (status 400)
        if (
          error.response.status === 400 &&
          typeof errorData.detail === "string"
        ) {
          throw new Error(errorData.detail);
        }
        // Manejar errores de validación (status 422)
        if (error.response.status === 422 && Array.isArray(errorData.detail)) {
          const errors = errorData.detail.map((err: any) => {
            const field = err.loc[1];
            return { field, message: err.msg };
          });
          throw { validationErrors: errors };
        }
        // Otros errores
        throw new Error(
          typeof errorData.detail === "string"
            ? errorData.detail
            : `Error ${error.response.status}`
        );
      }
      console.error("Register error:", error);
      throw error;
    }
  },

  logout: () => {
    // Eliminar el token de localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);

    // También eliminar de cookies
    Cookies.remove(AUTH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    // Verificar si existe el token en localStorage o en cookies
    return (
      !!localStorage.getItem(AUTH_TOKEN_KEY) || !!Cookies.get(AUTH_TOKEN_KEY)
    );
  },

  getToken: (): string | null => {
    return (
      localStorage.getItem(AUTH_TOKEN_KEY) ||
      Cookies.get(AUTH_TOKEN_KEY) ||
      null
    );
  },

  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiRequest<any>("/profiles/me", {
        method: "GET",
      });
      console.log("User profile response:", response);
      const data = response.data;

      // Guardar el perfil en localStorage para acceso rápido
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data));
      localStorage.setItem("id_profile", data.id); // Para compatibilidad con el tema

      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  getCachedUserProfile: (): UserProfile | null => {
    const profileData = localStorage.getItem(USER_PROFILE_KEY);
    return profileData ? JSON.parse(profileData) : null;
  },

  isProfileComplete: (profile_completion_percentage: number): boolean => {
    return profile_completion_percentage === 100;
  },
};
