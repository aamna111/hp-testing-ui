import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <Label
        htmlFor={htmlFor}
        className="text-xs font-semibold uppercase text-slate-600"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}
