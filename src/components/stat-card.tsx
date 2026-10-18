import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  footer: ReactNode;
  icon: LucideIcon;
  /** Background + text colour of the icon tile, e.g. "bg-emerald-50 text-emerald-600" */
  iconClassName: string;
}

export function StatCard({ label, value, footer, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card className="gap-0 rounded-xl border-slate-200/80 py-0 shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
          <div className="mt-1 text-xs font-medium">{footer}</div>
        </div>
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-xl",
            iconClassName
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
