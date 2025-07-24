import { format } from "date-fns";
import { authApi } from "./auth";
import { apiRequest } from "./api-client";

export const healthApi = {
  getSpikeStats: async (): Promise<any> => {
    try {
      const response = await apiRequest<any>("/spike/get-stats/", {
        method: "GET",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching spike stats:", error);
      throw error;
    }
  },
  getTestosteroneLevels: async (
    start_date: string,
    end_date: string
  ): Promise<any> => {
    try {
      const response = await apiRequest<any>(
        `/testosterone?start_date=${start_date}&end_date=${end_date}`,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching testosterone levels:", error);
      throw error;
    }
  },
};
