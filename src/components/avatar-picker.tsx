import { cn } from "@/lib/utils";

interface AvatarPickerProps {
  value: string;
  options: readonly string[];
  onChange: (url: string) => void;
}

export function AvatarPicker({ value, options, onChange }: AvatarPickerProps) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <div className="flex gap-2" role="radiogroup" aria-label="Profile photo">
        {options.map((url, i) => (
          <button
            key={url}
            type="button"
            role="radio"
            aria-checked={value === url}
            aria-label={`Photo option ${i + 1}`}
            onClick={() => onChange(url)}
            className={cn(
              "size-10 overflow-hidden rounded-full transition-opacity",
              value === url ? "ring-2 ring-sky-600" : "hover:opacity-80"
            )}
          >
            <img src={url} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
      <span className="text-xs text-slate-400">Click to select photo</span>
    </div>
  );
}
