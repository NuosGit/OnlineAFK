"use client";
import { useState, useRef, useEffect } from "react";

interface ImageSettingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageSetting({ isOpen, onClose }: ImageSettingProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("upload");
  const [gallery, setGallery] = useState<Array<{ id: string; url: string; createdAt?: string }>>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = () => {
    setIsLoadingGallery(true);
    setGalleryError(null);

    fetch("/api/images")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load images");
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data?.images) ? data.images : [];
        setGallery(items);
      })
      .catch((err) => setGalleryError(err?.message || "Failed to load images"))
      .finally(() => setIsLoadingGallery(false));
  };

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the transition triggers
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === "gallery") {
      fetchImages();
    }
  }, [isOpen, activeTab]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: selectedImage }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Upload failed");
      }

      await res.json();
      setSelectedImage(null);
      setActiveTab("gallery");
      fetchImages();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div
        className={`absolute inset-0 backdrop-blur-md transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-black border-4 border-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 z-10 transition-all duration-500 ${
          isAnimating 
            ? "scale-100 opacity-100 translate-y-0" 
            : "scale-50 opacity-0 translate-y-8"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-white">Images</h2>

        {/* Tabs */}
        <div className="mt-4 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md border transition-colors ${
              activeTab === "upload"
                ? "bg-white text-black border-white"
                : "bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500"
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md border transition-colors ${
              activeTab === "gallery"
                ? "bg-white text-black border-white"
                : "bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500"
            }`}
          >
            Gallery
          </button>
        </div>

        {activeTab === "upload" ? (
          <div className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-950"
                  : "border-gray-600 bg-gray-900"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded-lg"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-300">
                    Drag and drop your image here
                  </p>
                  <p className="mt-1 text-xs text-gray-400">or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 px-4 py-2 bg-white text-black text-sm rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Browse Files
                  </button>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>

            {uploadError && (
              <p className="text-sm text-red-400">{uploadError}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={!selectedImage || isUploading}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                  selectedImage && !isUploading
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isLoadingGallery && (
              <p className="text-sm text-gray-300">Loading images...</p>
            )}

            {galleryError && (
              <div className="space-y-2">
                <p className="text-sm text-red-400">{galleryError}</p>
                <button
                  onClick={fetchImages}
                  className="px-4 py-2 text-sm rounded-md bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {!isLoadingGallery && !galleryError && (
              <>
                {gallery.length === 0 ? (
                  <p className="text-sm text-gray-400">No images uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {gallery.map((image) => (
                      <div
                        key={image.id}
                        className="rounded-lg overflow-hidden border border-gray-700 bg-gray-900"
                      >
                        <img
                          src={image.url}
                          alt="Uploaded"
                          className="w-full h-32 object-cover"
                        />
                        {image.createdAt && (
                          <p className="px-2 py-1 text-[11px] text-gray-400 border-t border-gray-800">
                            {new Date(image.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
