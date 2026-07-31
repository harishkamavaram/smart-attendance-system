import { toast } from "sonner";
import instance from "../../instance";

export const handleRegisterAdmin = async (data) => {
  try {
    const response = await instance.post("/auth/admin/register", data);
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

export const handleLoginAdmin = async (data) => {
  try {
    console.log("Request Body:", data);
    const response = await instance.post("/auth/admin/login", data);
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

export const handleResendVerificationEmail = async (data) => {
  try {
    console.log("Request Body:", data);
    const response = await instance.post("/auth/admin/resendMail", data);
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Failed to resend verification email.";
    toast.error(message);
    throw error;
  }
};

export const handleVerifyToken = async (data) => {
  try {
    console.log("Request Body:", data);
    const response = await instance.post("/auth/admin/verify", data);
    return response.data;
  } catch (error) {
    console.log("Error Response:", error.response?.data);
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Failed to Verify email.";
    toast.error(message);
    throw error;
  }
};

export const handleForgotPassword = async (data) => {
  try {
    console.log("Request Body in handleForgotPassword:", data);
    const response = await instance.post("/auth/admin/forgotPassword", data);
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

export const handleVerifyOtp = async (data) => {
  try {
    console.log("Request Body in handleVerifyOtp:", data);
    const response = await instance.post("/auth/admin/verifyOtp", data);
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

export const handleUpdatePassword = async (data) => {
  try {
    console.log("Request Body in handleUpdatePassword:", data);
    const response = await instance.post("/auth/admin/updatePassword", data);
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

export const handleLogoutApi = async () => {
  try {
    const response = await instance.post("/auth/admin/logout");
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

export const handleRefresh = async () => {
  try {
    const response = await instance.post("/auth/admin/refresh");
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
