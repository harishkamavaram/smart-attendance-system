import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Camera,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { Badge, StatusChip } from '@/components/ui/Badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Button } from "@/components/ui/Button";
import { handleUploadPhotos } from "../../services/api/dashboard/student/api";
import { handleFetchStudentImagesById, handleFetchStudentsById, handleRegisterStudentEmbeddings, handleUploadStudentImages } from "../../services/api/studentList/api";
import { toast } from "sonner";

export default function FaceRegistrationCard(data) {
  const [student, setStudent] = useState([])
  // console.log("data: ",data)
  // console.log("student: ", student)


  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;

    const selected = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...selected]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const registerEmbeddings = async () => {
    if (!student.hasImages) {
      toast.error("Please upload images first");
      return;
    }
    console.log("Embedding Registration Button Clicked!")
    try {
      setIsImageLoading(true)
      const payload = {
        students: [
          {
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            imageUrls: urls.map((item) =>
              typeof item === "string" ? item : item.imageUrl
            ),
          },
        ],
      };
      console.log("Payload: ", payload)
      const response = await handleRegisterStudentEmbeddings(payload);
      console.log("Registration of embeddings: ", response)
      setStudent((prev) => ({
        ...prev,
        pointId: response.results[0].point_id,
        hasEmbeddings: true,
      }));
      if (response) {
        toast.success(response.message || "Registration Succussful")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsImageLoading(false)
    }
  }

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files);

    if (files.length === 0) return;
    console.log("Uploading images for student ID:", student.id, "Files:", files);

    const formData = new FormData();

    formData.append("student_id", student.id);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setIsImageLoading(true)
      const response = await handleUploadStudentImages(formData);
      console.log(response);
      if (response.student_id) {
        setStudent((prev) => ({
          ...prev,
          hasImages: true,
        }));
        setUrls((prev) => [...prev, ...response.image_urls]);
        toast.success("Images uploaded successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images");
    } finally {
      setIsImageLoading(false)
    }

    // Allow selecting the same file again
    e.target.value = "";
  };
  useEffect(() => {
    if (!data.id.id) return;

    const fetchStudent = async () => {
      try {
        setIsLoading(true);

        const response = await handleFetchStudentsById(data.id.id);
        // console.log("Fetched student:", response.data);
        setStudent(response.data || null);

        if (response.data?.hasImages) {
          console.log("Student has images");
          const imagesResponse = await handleFetchStudentImagesById(data.id.id);
          console.log("Fetched student images:", imagesResponse.data);
          setUrls(imagesResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        // toast.error("Failed to fetch student");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [data.id.id]);



  // const handleUpload = async () => {
  //   console.log(images);
  //   const formData = new FormData();
  //   formData.append("student_id", id);
  //   images.forEach((image) => {
  //     formData.append("files", image.file);
  //   });
  //   const response = await handleUploadPhotos(formData);
  //   console.log("response in ui: ", response)
  // };
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }
  return (
    <>
      {/* Tabs */}
      < Card >
        <CardHeader>
          <CardTitle>
            Face Registration
          </CardTitle>
        </CardHeader>

        <CardContent>

          <Tabs defaultValue="images">

            <TabsList>
              <TabsTrigger value="images">
                Images
              </TabsTrigger>

              <TabsTrigger value="embedding">
                Embeddings
              </TabsTrigger>
            </TabsList>

            {/* Images */}
            <TabsContent value="images">

              {student.hasImages && urls.length > 0 ? (
                <>
                  {/* {loadedImages < urls.length && (
                        <div className="flex items-center justify-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      )} */}

                  <div
                    className={`grid grid-cols-2 gap-4 md:grid-cols-3 
                         
                          }`}
                  >
                    {/*  ${loadedImages < urls.length ? "hidden" : "" */}
                    {urls.map((url, i) => (
                      <img
                        key={i}
                        src={typeof url === "string" ? url : url.imageUrl}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="aspect-square rounded-lg border object-cover"
                      />
                    ))}
                    {/* {urls.map((url, i) => (
                          <img
                            key={i}
                            src={url.imageUrl}
                            alt=""
                            className="aspect-square rounded-lg border object-cover"
                          // onLoad={() => setLoadedImages((prev) => prev + 1)}
                          // onError={() => setLoadedImages((prev) => prev + 1)}
                          />
                        ))} */}
                  </div>

                  <div className="mt-5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImageLoading}
                    >
                      {isImageLoading ? " Uploading....." : "Upload More Images"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No images uploaded yet.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />

                  <Button
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImageLoading}
                  >
                    {isImageLoading ? " Uploading....." : "Upload Images"}
                  </Button>
                </div>
              )}

            </TabsContent>

            {/* Embedding */}
            <TabsContent value="embedding">

              <div className="space-y-5">

                <div className="rounded-lg border p-4">

                  <div className="flex justify-between">

                    <span>Status</span>

                    <Badge
                      variant={
                        student.hasEmbeddings
                          ? "success"
                          : "warning"
                      }
                    >
                      {student.hasEmbeddings
                        ? "Registered"
                        : "Pending"}
                    </Badge>

                  </div>

                  <div className="mt-4 flex justify-between">

                    <span>Point ID</span>

                    <span className="font-medium">
                      {student.pointId ?? "-"}
                    </span>

                  </div>

                </div>

                {!student.hasImages && (
                  <Button disabled>
                    Upload Images First
                  </Button>
                )}

                {student.hasImages &&
                  !student.hasEmbeddings && (
                    <Button
                      onClick={registerEmbeddings}
                      disabled={isImageLoading}>
                      {isImageLoading ? "Registering" : "Register Embeddings"}
                    </Button>
                  )}

                {student.hasImages &&
                  student.hasEmbeddings && (
                    <div className="flex gap-3">

                      <Button
                        onClick={registerEmbeddings}
                        disabled={isImageLoading}>
                        {isImageLoading ? "Regenerating" : "Regenerate Embeddings"}
                      </Button>

                      {/* <Button variant="outline" onClick={deleteEmbeddings}>
                            {isDeleting ? "Deleting..." : "Delete Embeddings"}
                          </Button> */}

                    </div>
                  )}

              </div>

            </TabsContent>

          </Tabs>

        </CardContent>
      </Card >
    </>
  );
}