import { toast } from "sonner";
import instance from "../instance";

export const handleFetchAttendanceSessions = async () => {
  try {
    const response = await instance.get("/api/v1/attendance/sessions");
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance sessions:", error.response);
    const message =
      error.response?.data?.error ||
      "Failed to fetch attendance sessions";
    toast.error(message);
    throw error;
  }
};

export const handleCreateAttendanceSession = async (payload) => {
  try {
    const response = await instance.post(
      "/api/v1/attendance/sessions",
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating attendance session:", error);
    toast.error(
      error.response?.data?.data?.message || error.response?.data?.message,
    );
  }
};
