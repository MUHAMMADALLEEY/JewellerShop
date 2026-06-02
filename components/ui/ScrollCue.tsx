export default function ScrollCue({ label = "Scroll" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-eyebrow text-cream/60">{label}</span>
      <div className="relative h-10 w-px overflow-hidden">
        <span className="absolute inset-0 bg-gradient-to-b from-transparent via-gold to-transparent animate-scroll-cue" />
      </div>
    </div>
  );
}
