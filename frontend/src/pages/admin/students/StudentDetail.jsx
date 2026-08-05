import { useParams, Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Calendar, ScanFace, Pencil, ArrowLeft, GraduationCap, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusChip } from '@/components/ui/Badge'
import { Avatar, Progress } from '@/components/ui/Misc'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { Breadcrumb } from '@/components/ui/Controls'
import { getStudentById } from '@/mock/students'
import { subjects } from '@/mock/academics'
import { generateStudentCalendar } from '@/mock/attendance'
import { EmptyState } from '@/components/ui/Misc'
import { handleDeleteEmbeddings, handleFetchStudentImagesById, handleFetchStudentsById, handleRegisterStudentEmbeddings, handleUploadStudentImages } from '../../../services/api/studentList/api'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function StudentDetail() {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true);
  const [urls, setUrls] = useState([]);
  const [loadedImages, setLoadedImages] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef(null);


  // console.log("Student ID from URL:", id);
  const [student, setStudent] = useState(null);
  console.log("Student data:", student);

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
  // const deleteEmbeddings = async () => {
  //   try {
  //     setIsDeleting(true)
  //     const res = await handleDeleteEmbeddings(student.pointId)
  //     console.log("Delete Embeddings: ", res)
  //   } catch (err) {
  //     console.error(err)
  //   }
  //   finally {
  //     setIsDeleting(false)

  //   }
  // }

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
      if(response.student_id){
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
    if (!id) return;

    const fetchStudent = async () => {
      try {
        setIsLoading(true);

        const response = await handleFetchStudentsById(id);
        // console.log("Fetched student:", response.data);
        setStudent(response.data || null);

        if (response.data?.hasImages) {
          console.log("Student has images");
          const imagesResponse = await handleFetchStudentImagesById(id);
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
  }, [id]);

  useEffect(() => {
    setLoadedImages(0);
    console.log("URLs changed", urls);
  }, [urls]);

  if (!student) {
    return <EmptyState title="Student not found" description="This student may have been removed." action={<Link to="/admin/students"><Button>Back to students</Button></Link>} />
  }

  const calendar = generateStudentCalendar(student.firstName.length)
  // const subjectAttendance = subjects.slice(0, 4).map((s, i) => ({ ...s, percent: 65 + ((i * 13 + student.firstName.length) % 33) }))

  return isLoading ? (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="rounded-full bg-primary/10 p-5">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        Loading Student Details
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Please wait while we fetch the latest data...
      </p>
    </div>
  ) : (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Students", href: "/admin/students" },
          { label: `${student.firstName} ${student.lastName}` },
        ]}
      />

      <Link
        to="/admin/students"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Link>

      <div className="grid gap-5 lg:grid-cols-3">

        {/* Left */}
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar
              name={`${student.firstName} ${student.lastName}`}
              size={80}
            />

            <h2 className="mt-4 text-xl font-semibold">
              {student.firstName} {student.lastName}
            </h2>

            <p className="text-muted-foreground">
              {student.rollNumber}
            </p>

            <div className="mt-3 flex gap-2">
              <Badge variant="outline">
                Batch {student.batch}
              </Badge>

              <Badge variant="outline">
                Section {student.section}
              </Badge>
            </div>

            {/* <Button
              variant="outline"
              size="sm"
              className="mt-5 w-full"
            >
              <Pencil className="h-4 w-4" />
              Edit Student
            </Button> */}
          </div>

          <div className="mt-6 border-t pt-5 space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Student ID
              </span>

              <span className="font-medium">
                {student.id}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Roll Number
              </span>

              <span className="font-medium">
                {student.rollNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Batch
              </span>

              <span className="font-medium">
                {student.batch}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Section
              </span>

              <span className="font-medium">
                {student.section}
              </span>
            </div>

          </div>
        </Card>

        {/* Right */}
        <div className="space-y-5 lg:col-span-2">

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">

            <Card className="p-5 text-center">
              <p className="text-sm text-muted-foreground">
                Images
              </p>

              <Badge
                variant={
                  student.hasImages
                    ? "success"
                    : "destructive"
                }
                className="mt-3"
              >
                {student.hasImages
                  ? "Uploaded"
                  : "Not Uploaded"}
              </Badge>
            </Card>

            <Card className="p-5 text-center">
              <p className="text-sm text-muted-foreground">
                Embeddings
              </p>

              <Badge
                variant={
                  student.hasEmbeddings
                    ? "success"
                    : "warning"
                }
                className="mt-3"
              >
                {student.hasEmbeddings
                  ? "Registered"
                  : "Pending"}
              </Badge>
            </Card>

            <Card className="p-5 text-center">
              <p className="text-sm text-muted-foreground">
                Point ID
              </p>

              <p className="mt-3 font-medium">
                {student.pointId ?? "-"}
              </p>
            </Card>

          </div>

          {/* Tabs */}
          <Card>
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
                            alt=""
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
          </Card>

        </div>
      </div>
    </div>
  )
}
