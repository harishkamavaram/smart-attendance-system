import { toast } from "sonner";
import instance from "../instance";

export const handleFetchAttendanceSessions = async () => {
  try {
    const response = await instance.get("/api/v1/attendance/session-details");
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance sessions:", error.response);
    const message =
      error.response?.data?.error || "Failed to fetch attendance sessions";
    // toast.error(message);
    throw error;
  }
};

export const handlefetchAttendanceResult = async (id) => {
  try {
    const response = await instance.get(
      `/api/v1/attendance/session-details/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance sessions:", error.response);
    const message =
      error.response?.data?.error || "Failed to fetch attendance sessions";
    toast.error(message);
    throw error;
  }
};

export const handleFetchStudentsBySessionId = async (id) => {
  try {
    const response = await instance.get(
      `/api/v1/attendance/students/session/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance sessions:", error.response);
    const message =
      error.response?.data?.error || "Failed to fetch Students sessions";
    toast.error(message);
    throw error;
  }
};

export const handleDeleteSessionBySessionId = async (id) => {
  try {
    const response = await instance.delete(
      `/api/v1/attendance/session-details/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance sessions:", error.response);
    const message = error.response?.data?.error || "Failed to Delete Session";
    toast.error(message);
    throw error;
  }
};

export const handleFetchSections = async () => {
  try {
    const response = await instance.get("/api/v1/attendance/sections");
    return response.data;
  } catch (error) {
    console.error("Error fetching sections:", error.response);
    const message = error.response?.data?.error || "Failed to fetch sections";
    toast.error(message);
    throw error;
  }
};

export const handleCreateAttendanceSession = async (payload) => {
  try {
    const response = await instance.post(
      "/api/v1/attendance/session-details",
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

export const handleMarkAction = async (data) => {
  try {
    const response = await instance.post("/api/v1/attendance/mark", data);
    // console.log("handleMarkAction response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching sections:", error.response);
    const message = error.response?.data?.error || "Failed to fetch sections";
    toast.error(message);
    throw error;
  }
};

export const handleFetchAttendanceImages = async(id)=>{
  try{
    const response = await instance.get(`/api/v1/attendance/image-sessions/${id}`);
    // console.log("handleFetchAttendanceImages response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching sections:", error.response);
    const message = error.response?.data?.error || "Failed to fetch sections";
    toast.error(message);
    throw error;
  }
}