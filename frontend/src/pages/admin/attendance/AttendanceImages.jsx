import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../../../components/ui/Controls";
import { useEffect, useState } from "react";
import { handleFetchAttendanceImages } from "../../../services/api/attendance/api";

export default function AttendanceImages() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [imagePairs, setImagePairs] = useState([]);
    console.log("imagePairs: ",imagePairs)

    const fetchImages = async () => {
        console.log("ID: ", id)
        try {
            setIsLoading(true)
            const response = await handleFetchAttendanceImages(id);
            console.log("Response: ", response)
            setImagePairs(response);
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchImages();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }
    return (
        <div className="space-y-6 p-6">

            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/admin/dashboard" },
                    { label: "Attendance", href: "/admin/attendance/sessions" },
                    {
                        label: "Image Comparison"
                    }
                ]}
            />

            <Link
                to={`/admin/attendance/sessions/${id}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to sessions
            </Link>
            {imagePairs.length > 0 ? (
                imagePairs.map((item) => (
                    <Card key={item.id}>
                        <CardHeader>
                            <CardTitle>
                                Session ID: #{item.sessionId}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-center">
                                        Uploaded Image
                                    </h3>

                                    <img
                                        src={item.imageUrl}
                                        alt="Uploaded"
                                        className="w-full rounded-lg border object-cover"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-center">
                                        Response Image
                                    </h3>

                                    <img
                                        src={item.uploadedImageUrl}
                                        alt="Processed"
                                        className="w-full rounded-lg border object-cover"
                                    />
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">
                            No images found.
                        </p>

                        <Button onClick={() => navigate(-1)}>
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}