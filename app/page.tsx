import StartButton from "@/components/StartButton";
import ImageButton from "@/components/ImageButton";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 min-h-dvh p-4 items-center justify-center font-sans relative max-w-full mx-auto z-10 w-full">
      <div className="flex items-center justify-center text-6xl font-bold text-white">
        Online Afk'er
      </div>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-2 grid-rows-1 gap-4 items-center justify-center">
        <StartButton />
        <ImageButton />
        </div>
      </div>
    </div>
  );
}
