import { toast } from "sonner";
import instance from "../../instance";

export const handleRegisterStudents = async (file) => {
  try {
    console.log("Request Body:", file);
    const formData = new FormData();
    formData.append("file", file);

    const response = await instance.post("/auth/student/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Student import failed";

    toast.error(message);
    throw error;
  }
};

export const handleRegisterSingleStudent = async (data) => {
  try {
    console.log("handleRegisterSingleStudent Student Request Body:", data);
    const response = await instance.post("/auth/student/registerStudent", data);
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Password update failed";
    toast.error(message);
    throw error;
  }
};

export const handleUpdatePassword = async (data) => {
  try {
    console.log("handleUpdatePassword Student Request Body:", data);
    const response = await instance.post("/auth/student/updatePassword", data);
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Password update failed";
    toast.error(message);
    throw error;
  }
};

export const handleStudentLogin = async (data) => {
  try {
    console.log("handleStudentLogin Student Request Body:", data);
    const response = await instance.post("/auth/student/login", data);
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Password update failed";
    toast.error(message);
    throw error;
  }
};

export const handleStudentForgotPassword = async (data) => {
  try {
    console.log("Request Body in handleForgotPassword:", data);
    const response = await instance.post("/auth/student/forgotPassword", data);
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Failed to send forgot password email.";
    toast.error(message);
    throw error;
  }
};

export const handleStudentVerifyOtp = async (data) => {
  try {
    console.log("Request Body in handleVerifyOtp:", data);
    const response = await instance.post("/auth/student/verifyOtp", data);
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Failed to send forgot password email.";
    toast.error(message);
    throw error;
  }
};

export const handleStudentUpdatePassword = async (data) => {
  try {
    console.log("Request Body in handleUpdatePassword:", data);
    const response = await instance.post("/auth/student/updateForgotPassword", data);
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Failed to send forgot password email.";
    toast.error(message);
    throw error;
  }
};

export const handleStudentChangePassword= async (data) => {
  try {
    console.log("Request Body in handleStudentChangePassword:", data);
    const response = await instance.post("/auth/student/changePassword", data);
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Failed to send forgot password email.";
    toast.error(message);
    throw error;
  }
};

export const handleStudentLogoutApi = async () => {
  try {
    const response = await instance.post("/auth/student/logout");
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Failed to logout.";
    toast.error(message);
    throw error;
  }
};

export const handleStudentRefresh = async () => {
  try {
    const response = await instance.post("/auth/student/refresh");
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Failed to refresh token.";
    toast.error(message);
    throw error;
  }
};