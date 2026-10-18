import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Doctor, DoctorActionHandlers } from "../types";

interface DoctorActionsProps extends DoctorActionHandlers {
  doctor: Doctor;
}

/** View / edit / delete icon buttons used in each table row. */
export function DoctorActions({ doctor, onView, onEdit, onDelete }: DoctorActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        title="View Profile"
        aria-label={`View ${doctor.name}`}
        onClick={() => onView(doctor)}
        className="size-8 text-slate-400 hover:text-sky-600"
      >
        <Eye className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Edit Doctor"
        aria-label={`Edit ${doctor.name}`}
        onClick={() => onEdit(doctor)}
        className="size-8 text-slate-400 hover:text-sky-600"
      >
        <Pencil className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Remove Doctor"
        aria-label={`Remove ${doctor.name}`}
        onClick={() => onDelete(doctor)}
        className="size-8 text-slate-400 hover:text-rose-600"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
