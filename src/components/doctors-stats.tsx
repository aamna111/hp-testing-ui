import { ArrowUp, Building2, History, Stethoscope, UserCheck } from "lucide-react";
import type { DoctorStats } from "../types";
import { StatCard } from "./stat-card";

export function DoctorsStats({ stats }: { stats: DoctorStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Doctors"
        value={stats.total}
        icon={Stethoscope}
        iconClassName="bg-sky-50 text-sky-600"
        footer={
          <span className="flex items-center gap-1 text-emerald-600">
            <ArrowUp className="size-2.5" /> +2 added this month
          </span>
        }
      />
      <StatCard
        label="Active On Duty"
        value={stats.active}
        icon={UserCheck}
        iconClassName="bg-emerald-50 text-emerald-600"
        footer={
          <span className="text-slate-500">
            <span className="font-semibold text-emerald-600">{stats.activePercent}%</span>{" "}
            shift capacity
          </span>
        }
      />
      <StatCard
        label="Departments"
        value={stats.departments}
        icon={Building2}
        iconClassName="bg-teal-50 text-teal-600"
        footer={<span className="text-slate-500">Across 2 medical wings</span>}
      />
      <StatCard
        label="On Leave / Off Duty"
        value={stats.onLeave}
        icon={History}
        iconClassName="bg-amber-50 text-amber-600"
        footer={<span className="text-amber-600">Pending cover approvals</span>}
      />
    </div>
  );
}
