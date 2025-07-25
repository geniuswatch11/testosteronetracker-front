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
