import { toast } from "sonner";
import instance from "../instance";

export const handleFetchStudentsByInstituteId = async (id) => {
  try {
    const response = await instance.get(`/api/v1/data/students/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Login failed";
    toast.error(message);
    throw error;
  }
};

export const handleFetchCourses = async () => {
  try {
    const response = await instance.get("/api/v1/data/courses");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Login failed";
    toast.error(message);
    throw error;
  }
};
