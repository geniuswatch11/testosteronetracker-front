import { authApi, USER_PROFILE_KEY, UserProfile } from "./auth";
import { apiRequest } from "./api-client";
import toast from "react-hot-toast";

export interface PersonalData {
  weight: number;
  height: number;
  birthDate: string;
  first_name: string;
  last_name: string;
}

export const profileApi = {
  updatePersonalData: async (data: PersonalData): Promise<void> => {
    try {
      const response = await apiRequest(`/profiles/update-profile/`, {
        method: "POST",
        data: {
          birth_date: data.birthDate,
          height: data.height,
          weight: data.weight,
          first_name: data.first_name,
          last_name: data.last_name,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating personal data:", error);
      throw error;
    }
  },

  updateTheme: async (theme: string): Promise<void> => {
    try {
      const response = await apiRequest(`/profiles/update-profile/`, {
        method: "POST",
        data: {
          theme,
        },
      });
      console.log("Theme updated successfully:", response);
    } catch (error) {
      console.error("Error updating theme:", error);
      throw error;
    }
  },

  updateLanguage: async (lenguaje: string): Promise<void> => {
    try {
      const response = await apiRequest(`/profiles/update-profile/`, {
        method: "POST",
        data: {
          lenguaje,
        },
      });
      console.log("Language updated successfully:", response);
    } catch (error) {
      console.error("Error updating language:", error);
      throw error;
    }
  },

  getMyDevice: async (): Promise<any> => {
    try {
      const response = await apiRequest<any>("/spike/my-device/", {
        method: "GET",
      });
      console.log("my-device:", response);

      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
  checkDeviceConnected: async (): Promise<boolean> => {
    const response = await profileApi.getMyDevice();
    // Si response es null o undefined, no hay dispositivo
    if (!response) return false;
    // Si la respuesta tiene un campo 'data' y es null, no hay dispositivo
    if (response.data === null) return false;
    // Si hay datos, hay dispositivo conectado
    return true;
  },

  disconnectWhoop: async (): Promise<void> => {
    const idProfile = localStorage.getItem("id_profile");
    try {
      const response = await apiRequest(`/spike/delete/${idProfile}/`, {
        method: "DELETE",
      });
      toast.success("Whoop disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting Whoop:", error);
      throw error;
    }
  },

  connectDevice: async (device: string): Promise<void> => {
    try {
      // 1. Hacer la petición inicial para obtener el task_id
      const response = await apiRequest(`/spike/add/`, {
        method: "POST",
        data: {
          provider: device,
        },
      });
      const taskId = response.data?.data?.task_id || response.data?.task_id;
      if (!taskId) throw new Error("No se recibió task_id");

      // 2. Polling cada 5 segundos hasta 3 intentos
      let integrationUrl: string | null = null;
      const maxAttempts = 3;
      const delay = 5000; // 5 segundos

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const pollRes = await apiRequest(`/spike/results/${taskId}`, {
            method: "GET",
          });
          const pollData = pollRes;
          if (pollData.success) {
            integrationUrl = pollData.result?.data?.integration_url;
            if (integrationUrl) {
              window.location.href = integrationUrl;
              return;
            }
          }
        } catch (err) {
          console.warn(`Polling error en intento ${attempt}:`, err);
        }
        if (attempt === maxAttempts) {
          toast.error(
            "No se pudo conectar el dispositivo. Intenta nuevamente más tarde."
          );
        }
        if (attempt < maxAttempts) {
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    } catch (error) {
      console.error("Error connecting device:", error);
      throw error;
    }
  },
};
