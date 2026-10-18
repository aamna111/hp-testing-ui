import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DoctorStatus } from "../types";

const SOFT: Record<DoctorStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "On Leave": "bg-amber-50 text-amber-700 border-amber-200",
  Inactive: "bg-slate-100 text-slate-600 border-slate-200",
};

// The profile panel in the mock: green for Active, amber for everything else.
const SOLID: Record<DoctorStatus, string> = {
  Active: "bg-emerald-500 text-white border-transparent",
  "On Leave": "bg-amber-500 text-white border-transparent",
  Inactive: "bg-amber-500 text-white border-transparent",
};

interface StatusBadgeProps {
  status: DoctorStatus;
  variant?: "soft" | "solid";
  className?: string;
}

export function StatusBadge({ status, variant = "soft", className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full font-semibold",
        variant === "soft" ? SOFT[status] : SOLID[status],
        className
      )}
    >
      {status}
    </Badge>
  );
}
