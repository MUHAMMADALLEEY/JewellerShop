export default function SectionLabel({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px w-12 bg-gold/60" />
      <span className="text-eyebrow text-gold">
        {index} &nbsp;/&nbsp; {label}
      </span>
    </div>
  );
}
