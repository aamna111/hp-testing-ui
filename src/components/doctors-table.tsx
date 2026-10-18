import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Doctor, DoctorActionHandlers } from "../types";
import { DoctorActions } from "./doctor-actions";
import { DoctorAvatar } from "./doctor-avatar";
import { EmptyState } from "./empty-state";
import { StatusBadge } from "./status-badge";

interface DoctorsTableProps extends DoctorActionHandlers {
  doctors: Doctor[];
}

const headCls =
  "px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400";

export function DoctorsTable({ doctors, ...handlers }: DoctorsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow>
            <TableHead className={headCls}>Doctor</TableHead>
            <TableHead className={headCls}>Specialty & Dept</TableHead>
            <TableHead className={headCls}>Contact Details</TableHead>
            <TableHead className={headCls}>Experience / Shift</TableHead>
            <TableHead className={headCls}>Status</TableHead>
            <TableHead className={`${headCls} text-right`}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-slate-50/80">
              <TableCell className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <DoctorAvatar name={doc.name} src={doc.avatar} />
                  <div>
                    <h4 className="font-semibold leading-tight text-slate-900">
                      {doc.name}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-400">ID: #{doc.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <span className="font-medium text-slate-800">{doc.specialty}</span>
                <p className="text-xs text-slate-400">{doc.department || "General"}</p>
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <span className="text-xs font-medium text-slate-700">{doc.email}</span>
                <p className="text-xs text-slate-400">{doc.phone}</p>
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <span className="font-medium text-slate-800">{doc.experience} Years</span>
                <p className="text-xs text-slate-400">{doc.shift}</p>
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <StatusBadge status={doc.status} />
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <DoctorActions doctor={doc} {...handlers} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {doctors.length === 0 && <EmptyState />}
    </div>
  );
}
