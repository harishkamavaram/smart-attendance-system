import { toast } from "sonner";
import instance from "../../instance";

export const handleFetchDashboardInfo = async (id) => {
  try {
    const response = await instance.get(`/api/v1/data/dashboard/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Failed To Fetch";
    toast.error(message);
    throw error;
  }
};
    
