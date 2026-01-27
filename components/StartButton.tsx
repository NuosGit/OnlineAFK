"use client";
import Button from "./ui/Button";

export default function StartButton() {
  return (
    <div className="w-full flex items-center justify-between">
      <Button
        imageDefault="/start_white.svg"
        imageHover="/start_black.svg"
        imageAlt="Start"
        onClick={() => window.open("https://www.youtube.com", "_blank")}
      />
    </div>
  );
}
