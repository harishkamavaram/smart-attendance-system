import { toast } from "sonner";
import instance from "../../instance";

// export const handleFetchFileUploadHistory = async (data) => {
//   try {
//     // const response = await instance.post("/auth/admin/register", data);
//     return response.data;
//   } catch (error) {
//     const message =
//       error.response?.data?.data?.message ||
//       error.response?.data?.message ||
//       "Login failed";
//     toast.error(message);
//     throw error;
//   }
// };