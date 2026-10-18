import { useEffect, useState, type FormEvent } from "react";
import { CalendarClock, CreditCard, Loader2, Mail, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/form-field";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/types";
import { PAYMENT_BADGE, PAYMENT_LABEL, STATUS_STYLES } from "./chip";
import { endTime, formatTime, fromKey, longDay, ordinal } from "./date-utils";
import { formatINR } from "./money";
import type { Appointment, AppointmentFormValues, AppointmentStatus } from "./types";

const DURATIONS = [15, 30, 45, 60];

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctors: Doctor[];
  /** Used to prefill date (and doctor) when opening the dialog. */
  defaults: AppointmentFormValues;
  onSubmit: (values: AppointmentFormValues) => void;
}

export function AppointmentFormDialog({
  open,
  onOpenChange,
  doctors,
  defaults,
  onSubmit,
}: FormDialogProps) {
  const [values, setValues] = useState<AppointmentFormValues>(defaults);

  useEffect(() => {
    if (open) setValues(defaults);
  }, [open, defaults]);

  const set = <K extends keyof AppointmentFormValues>(k: K, v: AppointmentFormValues[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const fee = doctors.find((d) => d.id === values.doctorId)?.consultationFee ?? null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.doctorId) return;
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg [&>button]:text-slate-300 [&>button]:hover:text-white">
        <DialogHeader className="bg-slate-900 px-6 py-4 text-left text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500">
              <CalendarClock className="size-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-indigo-300 uppercase">
                Step 1 of 2 · Details
              </p>
              <DialogTitle className="text-lg font-bold">Book appointment</DialogTitle>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Choose a patient, doctor, date and time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 p-6">
          <FormField label="Patient name *" htmlFor="apPatient">
            <Input
              id="apPatient"
              required
              value={values.patient}
              onChange={(e) => set("patient", e.target.value)}
              placeholder="e.g. Anita Verma"
              className="bg-slate-50"
            />
          </FormField>

          <FormField label="Doctor *">
            <Select value={values.doctorId} onValueChange={(v) => set("doctorId", v)}>
              <SelectTrigger className="w-full bg-slate-50">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} · {d.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Date *" htmlFor="apDate">
              <Input
                id="apDate"
                type="date"
                required
                value={values.date}
                onChange={(e) => set("date", e.target.value)}
                className="bg-slate-50"
              />
            </FormField>
            <FormField label="Time *" htmlFor="apTime">
              <Input
                id="apTime"
                type="time"
                required
                value={values.time}
                onChange={(e) => set("time", e.target.value)}
                className="bg-slate-50"
              />
            </FormField>
            <FormField label="Length">
              <Select
                value={String(values.durationMin)}
                onValueChange={(v) => set("durationMin", Number(v))}
              >
                <SelectTrigger className="w-full bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Reason for visit" htmlFor="apReason">
            <Input
              id="apReason"
              value={values.reason}
              onChange={(e) => set("reason", e.target.value)}
              placeholder="e.g. Follow-up consultation"
              className="bg-slate-50"
            />
          </FormField>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Consultation fee
            </span>
            <span className="text-lg font-bold text-slate-900">
              {fee === null ? "—" : formatINR(fee)}
            </span>
          </div>

          <DialogFooter className="border-t border-slate-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!values.doctorId}
              className="bg-indigo-500 font-semibold text-white hover:bg-indigo-600"
            >
              <CreditCard className="size-4" />
              Continue to payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DetailsDialogProps {
  appointment: Appointment | null;
  doctor: Doctor | undefined;
  onClose: () => void;
  onStatus: (id: string, status: AppointmentStatus) => void;
  /** Cancels the visit; refunds the payment first when it was paid. */
  onCancel: (id: string) => Promise<void>;
  onPay: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export function AppointmentDetailsDialog({
  appointment: a,
  doctor,
  onClose,
  onStatus,
  onCancel,
  onPay,
  onDelete,
}: DetailsDialogProps) {
  const [busy, setBusy] = useState(false);
  const date = a ? fromKey(a.date) : null;
  return (
    <Dialog open={!!a} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md [&>button]:text-slate-300 [&>button]:hover:text-white">
        {a && date && (
          <>
            <DialogHeader className="bg-slate-900 px-6 py-4 text-left text-white">
              <DialogTitle className="text-lg font-bold">{a.patient}</DialogTitle>
              <DialogDescription className="text-xs text-indigo-300">
                {a.reason || "General consultation"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  {longDay(date)}, {date.toLocaleDateString("en-US", { month: "long" })}{" "}
                  {ordinal(date.getDate())}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold no-underline",
                    STATUS_STYLES[a.status].split(" ").filter((c) => !c.startsWith("hover:") && c !== "line-through").join(" ")
                  )}
                >
                  {a.status}
                </span>
              </div>

              <div className="space-y-2.5 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <CalendarClock className="size-4 text-slate-400" />
                  {formatTime(a.time)} – {formatTime(endTime(a.time, a.durationMin))} ({a.durationMin} min)
                </div>
                {doctor && (
                  <>
                    <div className="flex items-center gap-3">
                      <Stethoscope className="size-4 text-slate-400" />
                      {doctor.name} · {doctor.specialty}
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="size-4 text-slate-400" />
                      {doctor.email}
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Payment</span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      PAYMENT_BADGE[a.paymentStatus]
                    )}
                  >
                    {PAYMENT_LABEL[a.paymentStatus]}
                  </span>
                </div>
                <p className="mt-1 text-lg font-bold text-slate-900">{formatINR(a.fee)}</p>
                {a.paymentStatus !== "Pending" && a.paymentId && (
                  <p className="mt-1 text-xs text-slate-500">
                    {a.paymentMethod} · {a.receiptNo} · {a.paymentId}
                  </p>
                )}
                {a.paymentStatus === "Pending" && a.status === "Scheduled" && (
                  <Button
                    className="mt-3 w-full bg-indigo-500 font-semibold text-white hover:bg-indigo-600"
                    onClick={() => {
                      onClose();
                      onPay(a);
                    }}
                  >
                    <CreditCard className="size-4" />
                    Pay {formatINR(a.fee)} now
                  </Button>
                )}
                {a.paymentStatus === "Paid" && a.status === "Scheduled" && (
                  <p className="mt-2 text-xs text-slate-500">
                    Cancelling will refund {formatINR(a.fee)} to the original payment method.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="border-t border-slate-100 bg-slate-50 px-6 py-4 sm:justify-between">
              {a.paymentStatus === "Paid" ? (
                <span />
              ) : (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => {
                    onDelete(a.id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              )}
              <div className="flex gap-2">
                {a.status === "Scheduled" ? (
                  <>
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        try {
                          await onCancel(a.id);
                          onClose();
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      {busy && <Loader2 className="size-3.5 animate-spin" />}
                      {busy ? "Refunding…" : a.paymentStatus === "Paid" ? "Cancel & refund" : "Cancel visit"}
                    </Button>
                    <Button
                      disabled={busy || a.paymentStatus !== "Paid"}
                      title={a.paymentStatus !== "Paid" ? "Payment must be completed first" : undefined}
                      className="bg-indigo-500 text-white hover:bg-indigo-600"
                      onClick={() => {
                        onStatus(a.id, "Completed");
                        onClose();
                      }}
                    >
                      Mark completed
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onStatus(a.id, "Scheduled");
                      onClose();
                    }}
                  >
                    Reopen
                  </Button>
                )}
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
