import { toast } from "sonner";
import instance from "../instance";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const res = await instance.post("/api/v1/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Image upload response:", res.data);
    // console.log("Image uploaded successfully:", res.data.imageUrl);
    const imageUrl = res.data.imageUrl === undefined ?  res.data.results[0].imageUrl : res.data.imageUrl;
    return imageUrl;
  } catch (err) {
    console.error("Error uploading image:", err);
    toast.error("Failed to upload image");  
    throw err;
  }
};
export const identifyFaces = async (data) => {
    try{
  const res = await instance.post("/api/v1/fr/faces", data);

  return res;
}catch (err) {
    console.error("Error identifying faces:", err);
    toast.error("Failed to identify faces");  
    throw err;
  }
};
