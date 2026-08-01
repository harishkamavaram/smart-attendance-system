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
export const handleFetchStudentsById = async (id) => {
  try {
    const response = await instance.get(`/api/v1/data/students/find/${id}`);
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

export const handleFetchStudentImagesById = async (id) => {
  try {
    const response = await instance.get(`/api/v1/data/studentImages/${id}`);
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

export const handleUploadStudentImages = async (formData) => {
  try {
    const response = await instance.post(`/api/v1/images/insertStudentImages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
