import { toast } from "sonner";
import instance from "../../instance";

export const handleUploadPhotos = async (formData) => {
  try {
    for (const [key, value] of formData.entries()) {
      console.log(key, value.name);
    }
    const response = await instance.post("/api/v1/fr/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("handleUploadPhotos: ", response);

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      "Student import failed";
    console.log("message: ", message);
    toast.error(message);
    throw error;
  }
};
