import { useRef, useState } from "react";
import {
  Upload,
  Camera,
  ImagePlus,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

import { Button } from "@/components/ui/Button";

export default function FaceRegistrationCard() {
  const [images, setImages] = useState([]);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

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

  const handleUpload = () => {
    console.log(images);

    // const formData = new FormData();
    // images.forEach((img) => {
    //   formData.append("images", img.file);
    // });
    //
    // await uploadImages(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Face Registration</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Hidden Inputs */}

        {/* Camera */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Gallery */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Drag & Drop Area */}

        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => galleryInputRef.current.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-primary/40 p-8 transition hover:border-primary hover:bg-primary/5"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <Upload className="h-10 w-10 text-primary" />

            <div>
              <p className="font-semibold text-base">
                Drag & Drop Images
              </p>

              <p className="text-sm text-muted-foreground">
                or click to choose from your device
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}

        {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            onClick={() => cameraInputRef.current.click()}
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => galleryInputRef.current.click()}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Choose from Gallery
          </Button>
        </div> */}

        {/* Image Preview */}

        {images.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                Selected Images ({images.length})
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg border"
                >
                  <img
                    src={img.preview}
                    alt="preview"
                    className="h-36 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={handleUpload}
            >
              Upload Face Images
            </Button>
          </>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Upload <strong>3–5 clear photos</strong> of your face from different
          angles.
           {/* On mobile, tap <strong>Take Photo</strong> to open your camera
          or <strong>Choose from Gallery</strong> to select existing photos. */}
        </p>
      </CardContent>
    </Card>
  );
}