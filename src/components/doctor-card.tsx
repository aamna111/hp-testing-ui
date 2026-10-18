import type { ComponentType } from "react";
import { Briefcase, Building2, Mail, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import type { Doctor, DoctorActionHandlers } from "../types";
import { DoctorAvatar } from "./doctor-avatar";
import { StatusBadge } from "./status-badge";

function InfoLine({
  icon: Icon,
  children,
  truncate,
}: {
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-slate-400" />
      <span className={truncate ? "truncate" : undefined}>{children}</span>
    </div>
  );
}

interface DoctorCardProps extends DoctorActionHandlers {
  doctor: Doctor;
}

export function DoctorCard({ doctor, onView, onEdit, onDelete }: DoctorCardProps) {
  return (
    <Card className="justify-between gap-4 rounded-xl border-slate-200/80 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <DoctorAvatar name={doctor.name} src={doctor.avatar} className="size-12" />
            <div>
              <h4 className="font-bold text-slate-900">{doctor.name}</h4>
              <p className="text-xs font-semibold text-sky-600">{doctor.specialty}</p>
            </div>
          </div>
          <StatusBadge status={doctor.status} className="text-[11px]" />
        </div>

        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <InfoLine icon={Building2}>{doctor.department || "General Department"}</InfoLine>
          <InfoLine icon={Mail} truncate>
            {doctor.email}
          </InfoLine>
          <InfoLine icon={Phone}>{doctor.phone}</InfoLine>
          <InfoLine icon={Briefcase}>
            {doctor.experience} Years Exp • {doctor.shift}
          </InfoLine>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <Button
          variant="link"
          size="sm"
          onClick={() => onView(doctor)}
          className="h-auto p-0 text-xs font-semibold text-sky-600"
        >
          View Profile
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(doctor)}
            className="h-7 px-2.5 text-xs font-semibold"
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDelete(doctor)}
            className="h-7 bg-rose-50 px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
          >
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
}
