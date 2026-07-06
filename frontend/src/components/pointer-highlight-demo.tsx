import { PointerHighlight } from "@/components/ui/pointer-highlight";

export default function PointerHighlightDemo() {
  return (
    <div className="mx-auto max-w-2xl py-12 px-4 text-center text-3xl font-extrabold tracking-tight md:text-5xl text-white flex flex-col items-center justify-center gap-4">
      <span className="opacity-90">Experience Minecraft fully</span>
      <PointerHighlight
        containerClassName="inline-block"
        rectangleClassName="border-emerald-400 dark:border-emerald-400"
        pointerClassName="text-emerald-400"
      >
        <span className="text-emerald-400 px-3 py-1 font-black">optimized</span>
      </PointerHighlight>
    </div>
  );
}
