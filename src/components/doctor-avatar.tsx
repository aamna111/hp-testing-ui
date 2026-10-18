import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/i, "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

interface DoctorAvatarProps {
  name: string;
  src: string;
  className?: string;
}

export function DoctorAvatar({ name, src, className }: DoctorAvatarProps) {
  return (
    <Avatar className={cn("size-10", className)}>
      <AvatarImage src={src} alt={name} className="object-cover" />
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
