import type { Doctor, DoctorActionHandlers } from "../types";
import { DoctorCard } from "./doctor-card";
import { EmptyState } from "./empty-state";

interface DoctorsGridProps extends DoctorActionHandlers {
  doctors: Doctor[];
}

export function DoctorsGrid({ doctors, ...handlers }: DoctorsGridProps) {
  if (doctors.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doc) => (
        <DoctorCard key={doc.id} doctor={doc} {...handlers} />
      ))}
    </div>
  );
}
