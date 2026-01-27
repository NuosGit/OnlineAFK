"use client";
import Button from "./ui/Button";

export default function ImageButton() {
  return (
    <div className="w-full flex items-center justify-between">
      <Button
        imageDefault="/image_white.svg"
        imageHover="/image_black.svg"
        imageAlt="Image"
        onClick={() => window.open("https://www.youtube.com", "_blank")}
      />
    </div>
  );
}
