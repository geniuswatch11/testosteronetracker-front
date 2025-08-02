import Cookies from "js-cookie";
import { apiRequest } from "./api-client";
import toast from "react-hot-toast";

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
  first_name: string;
  last_name: string;
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
    const response = await apiRequest<any>("/login/", {
      method: "POST",
      data: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    const data = response.data;
    console.log("Login response:", data);

    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    Cookies.set(AUTH_TOKEN_KEY, data.access_token, { expires: 1 }); // 1 día
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<any> => {
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
    console.log("Register response:", data);

    // Guardar el email para autocompletar en el login
    localStorage.setItem(REGISTER_EMAIL_KEY, credentials.email);

    return data;
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

      return data.data;
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
