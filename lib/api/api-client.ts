import { authApi } from "./auth";
import toast from "react-hot-toast";
import { translations } from "@/lib/i18n/translations";
import { BASE_URL } from "./config";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// Instancia de Axios con baseURL
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use((config) => {
  // Puedes obtener el token de localStorage, cookies, etc.
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar 401
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const currentLang = localStorage.getItem("locale") || "en";
      const lang = currentLang === "es" ? "es" : "en";
      const common = translations[lang].common;
      const tokenExpiredMsg =
        typeof common === "string" ? common : common.tokenExpired;
      toast.error(typeof tokenExpiredMsg === "string" ? tokenExpiredMsg : "");
      //authApi.logout();
      //window.location.href = "/login";
      return Promise.reject(new Error("Unauthorized: Token expired"));
    }
    return Promise.reject(error);
  }
);

/**
 * Utilidad para hacer requests usando Axios
 * @param url endpoint relativo (sin BASE_URL)
 * @param config configuración de Axios opcional
 */
export async function apiRequest<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return api(url, config);
}
