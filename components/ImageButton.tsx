"use client";
import { useState } from "react";
import Button from "./ui/Button";
import ImageSetting from "./ImageSetting";

export default function ImageButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <Button
          imageDefault="/image_white.svg"
          imageHover="/image_black.svg"
          imageAlt="Image"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <ImageSetting
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
