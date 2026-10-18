import { cn } from "@/lib/utils";
import { formatTime } from "./date-utils";
import type { Appointment, PaymentStatus } from "./types";

export const STATUS_STYLES: Record<Appointment["status"], string> = {
  Scheduled: "bg-indigo-500 text-white hover:bg-indigo-600",
  Completed: "bg-indigo-100 text-indigo-500 hover:bg-indigo-200",
  Cancelled: "bg-slate-100 text-slate-400 line-through hover:bg-slate-200",
};

const PENDING_STYLE =
  "border border-dashed border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100";

/** Colour for a calendar block: unpaid upcoming visits get a dashed amber look. */
export function chipStyle(a: Appointment) {
  return a.status === "Scheduled" && a.paymentStatus === "Pending"
    ? PENDING_STYLE
    : STATUS_STYLES[a.status];
}

export const PAYMENT_BADGE: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Refunded: "bg-slate-100 text-slate-500",
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  Paid: "Paid",
  Pending: "Payment pending",
  Refunded: "Refunded",
};

interface ChipProps {
  appointment: Appointment;
  onClick: (a: Appointment) => void;
  className?: string;
}

/** Compact calendar pill: "9:00am  Anita Verma". */
export function AppointmentChip({ appointment: a, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(a);
      }}
      title={`${formatTime(a.time)} · ${a.patient} — ${a.reason} (${PAYMENT_LABEL[a.paymentStatus]})`}
      className={cn(
        "block w-full truncate rounded-[5px] px-2 py-[3px] text-left text-[10.5px] font-semibold transition-colors",
        chipStyle(a),
        className
      )}
    >
      {formatTime(a.time).replace(" ", "").toLowerCase()} {a.patient}
    </button>
  );
}
