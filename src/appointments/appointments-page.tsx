import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEED_DOCTORS } from "@/data";
import { AppointmentDetailsDialog, AppointmentFormDialog } from "./appointment-dialogs";
import { DayView, MonthView, WeekView } from "./calendar-views";
import { PaymentDialog } from "./payment-dialog";
import { HOLD_MINUTES, refund, type PaymentResult } from "./payment-service";
import { formatINR } from "./money";
import { buildSeedAppointments } from "./data";
import {
  MONTH_NAMES,
  addDays,
  addMonths,
  longDay,
  ordinal,
  startOfWeek,
  toKey,
} from "./date-utils";
import type {
  Appointment,
  AppointmentFormValues,
  AppointmentStatus,
  CalendarView,
  PaymentStatus,
} from "./types";

const VIEWS: { id: CalendarView; label: string }[] = [
  { id: "day", label: "DAY" },
  { id: "week", label: "WEEK" },
  { id: "month", label: "MONTH" },
];

const STATUSES: AppointmentStatus[] = ["Scheduled", "Completed", "Cancelled"];
const PAYMENTS: PaymentStatus[] = ["Paid", "Pending", "Refunded"];

function Check({
  checked,
  onChange,
  children,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-md bg-white px-3 py-2 text-xs font-medium shadow-sm ring-1 ring-slate-100 transition-opacity",
        checked ? "text-slate-700" : "text-slate-400"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-3.5 shrink-0 accent-indigo-500"
      />
      <span className="flex-1 truncate">{children}</span>
      <span className="text-[10px] tabular-nums text-slate-300">{count}</span>
    </label>
  );
}

export default function AppointmentsPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [appointments, setAppointments] = useState<Appointment[]>(() => buildSeedAppointments());
  const [doctorsOn, setDoctorsOn] = useState<Set<string>>(
    () => new Set(SEED_DOCTORS.map((d) => d.id))
  );
  const [statusOn, setStatusOn] = useState<Set<AppointmentStatus>>(() => new Set(STATUSES));

  const [paymentOn, setPaymentOn] = useState<Set<PaymentStatus>>(() => new Set(PAYMENTS));

  const [selected, setSelected] = useState<Appointment | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<AppointmentFormValues>({
    patient: "",
    doctorId: "",
    date: toKey(new Date()),
    time: "09:00",
    durationMin: 30,
    reason: "",
  });

  const doctorName = (id: string) => SEED_DOCTORS.find((d) => d.id === id)?.name ?? "Unknown";

  const visible = useMemo(
    () => appointments.filter((a) => doctorsOn.has(a.doctorId) && statusOn.has(a.status) && paymentOn.has(a.paymentStatus)),
    [appointments, doctorsOn, statusOn, paymentOn]
  );

  const byDate = useMemo(() => {
    const m = new Map<string, Appointment[]>();
    for (const a of visible) {
      const list = m.get(a.date) ?? [];
      list.push(a);
      m.set(a.date, list);
    }
    for (const list of m.values()) list.sort((x, y) => x.time.localeCompare(y.time));
    return m;
  }, [visible]);

  const toggle = <T,>(set: Set<T>, value: T, apply: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    apply(next);
  };

  const step = (dir: 1 | -1) =>
    setCursor((c) =>
      view === "month" ? addMonths(c, dir) : addDays(c, dir * (view === "week" ? 7 : 1))
    );

  const openForm = (dateKey: string = toKey(cursor)) => {
    setFormDefaults((d) => ({ ...d, date: dateKey, patient: "", reason: "" }));
    setFormOpen(true);
  };

  // Release slots whose payment hold ran out.
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      setAppointments((prev) => {
        const next = prev.filter(
          (a) => !(a.paymentStatus === "Pending" && a.holdExpiresAt && a.holdExpiresAt < now)
        );
        return next.length === prev.length ? prev : next;
      });
    }, 5000);
    return () => clearInterval(t);
  }, []);

  /** Step 1 done: save the appointment as pending and move on to payment. */
  const startBooking = (values: AppointmentFormValues) => {
    const fee = SEED_DOCTORS.find((d) => d.id === values.doctorId)?.consultationFee ?? 0;
    const id = `a${Date.now()}`;
    const free = fee === 0;
    setAppointments((prev) => [
      ...prev,
      {
        ...values,
        id,
        status: "Scheduled",
        fee,
        paymentStatus: free ? "Paid" : "Pending",
        holdExpiresAt: free ? undefined : Date.now() + HOLD_MINUTES * 60_000,
      },
    ]);
    if (!free) setPayingId(id);
  };

  const markPaid = (id: string, r: PaymentResult) =>
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              paymentStatus: "Paid",
              paymentMethod: r.method,
              paymentId: r.paymentId,
              receiptNo: r.receiptNo,
              paidAt: r.paidAt,
              holdExpiresAt: undefined,
            }
          : a
      )
    );

  const cancelAppointment = async (id: string) => {
    const a = appointments.find((x) => x.id === id);
    if (a?.paymentStatus === "Paid" && a.paymentId) await refund(a.paymentId);
    setAppointments((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              status: "Cancelled",
              paymentStatus: x.paymentStatus === "Paid" ? "Refunded" : x.paymentStatus,
            }
          : x
      )
    );
  };

  /** Reopening a refunded visit needs a fresh payment, so it goes back to pending. */
  const reopen = (id: string, status: AppointmentStatus) =>
    setAppointments((prev) =>
      prev.map((a) =>
        a.id !== id
          ? a
          : a.paymentStatus === "Refunded"
            ? { ...a, status, paymentStatus: "Pending", holdExpiresAt: Date.now() + HOLD_MINUTES * 60_000 }
            : { ...a, status }
      )
    );

  const remove = (id: string) => setAppointments((prev) => prev.filter((a) => a.id !== id));

  const title =
    view === "day"
      ? `${longDay(cursor)}, ${MONTH_NAMES[cursor.getMonth()].slice(0, 3)} ${ordinal(cursor.getDate())}`
      : view === "week"
        ? (() => {
            const s = startOfWeek(cursor);
            const e = addDays(s, 6);
            const sm = MONTH_NAMES[s.getMonth()].slice(0, 3);
            const em = MONTH_NAMES[e.getMonth()].slice(0, 3);
            return `${sm} ${s.getDate()} – ${sm === em ? "" : em + " "}${e.getDate()}`;
          })()
        : `${MONTH_NAMES[cursor.getMonth()]} ${cursor.getFullYear()}`;

  const countFor = (pred: (a: Appointment) => boolean) => appointments.filter(pred).length;
  const todayCount = byDate.get(toKey(new Date()))?.length ?? 0;
  const collected = appointments.reduce((sum, a) => sum + (a.paymentStatus === "Paid" ? a.fee : 0), 0);
  const payingAppt = appointments.find((a) => a.id === payingId) ?? null;

  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Filter panel */}
      <aside className="hidden w-60 shrink-0 border-r border-slate-100 bg-indigo-50/50 p-4 lg:block">
        <div className="mb-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCursor(new Date())}
            className="h-9 flex-1 rounded-md bg-indigo-100 text-[11px] font-bold tracking-wider text-indigo-500 transition-colors hover:bg-indigo-200"
          >
            TODAY
          </button>
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir === -1 ? "Previous" : "Next"}
              onClick={() => step(dir)}
              className="flex size-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-indigo-100 hover:text-indigo-600"
            >
              {dir === -1 ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
          ))}
        </div>

        <p className="mb-5 text-xs text-slate-500">
          <span className="font-bold text-indigo-600">{todayCount}</span> appointment
          {todayCount === 1 ? "" : "s"} today
          <br />
          <span className="font-bold text-emerald-600">{formatINR(collected)}</span> collected
        </p>

        <h3 className="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Doctors
        </h3>
        <div className="mb-6 space-y-2">
          {SEED_DOCTORS.map((d) => (
            <Check
              key={d.id}
              checked={doctorsOn.has(d.id)}
              onChange={() => toggle(doctorsOn, d.id, setDoctorsOn)}
              count={countFor((a) => a.doctorId === d.id)}
            >
              {d.name}
            </Check>
          ))}
        </div>

        <h3 className="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Payment
        </h3>
        <div className="mb-6 space-y-2">
          {PAYMENTS.map((p) => (
            <Check
              key={p}
              checked={paymentOn.has(p)}
              onChange={() => toggle(paymentOn, p, setPaymentOn)}
              count={countFor((a) => a.paymentStatus === p)}
            >
              {p}
            </Check>
          ))}
        </div>

        <h3 className="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Status
        </h3>
        <div className="space-y-2">
          {STATUSES.map((s) => (
            <Check
              key={s}
              checked={statusOn.has(s)}
              onChange={() => toggle(statusOn, s, setStatusOn)}
              count={countFor((a) => a.status === s)}
            >
              {s}
            </Check>
          ))}
        </div>
      </aside>

      {/* Calendar */}
      <section className="min-w-0 flex-1">
        <div className="flex flex-wrap items-end justify-between gap-4 px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-700">{title}</h1>
            <div className="ml-2 flex lg:hidden">
              <button type="button" aria-label="Previous" onClick={() => step(-1)} className="p-1 text-slate-400 hover:text-indigo-600">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" aria-label="Next" onClick={() => step(1)} className="p-1 text-slate-400 hover:text-indigo-600">
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-6">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={cn(
                  "border-b-2 pb-1.5 text-[11px] font-bold tracking-wider transition-colors",
                  view === v.id
                    ? "border-indigo-500 text-indigo-500"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100">
          {view === "month" && (
            <MonthView
              cursor={cursor}
              byDate={byDate}
              onSelect={setSelected}
              onAddOn={openForm}
              onOpenDay={(d) => {
                setCursor(d);
                setView("day");
              }}
            />
          )}
          {view === "week" && (
            <WeekView
              cursor={cursor}
              byDate={byDate}
              onSelect={setSelected}
              onAddOn={openForm}
              doctorName={doctorName}
            />
          )}
          {view === "day" && (
            <DayView
              cursor={cursor}
              byDate={byDate}
              onSelect={setSelected}
              onAddOn={openForm}
              doctorName={doctorName}
            />
          )}
        </div>
      </section>

      <button
        type="button"
        aria-label="Book appointment"
        onClick={() => openForm()}
        className="fixed right-8 bottom-8 z-30 flex size-12 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105 hover:bg-indigo-600"
      >
        <Plus className="size-5" />
      </button>

      <AppointmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        doctors={SEED_DOCTORS}
        defaults={formDefaults}
        onSubmit={startBooking}
      />
      <PaymentDialog
        appointment={payingAppt}
        doctor={SEED_DOCTORS.find((d) => d.id === payingAppt?.doctorId)}
        onClose={() => setPayingId(null)}
        onPaid={markPaid}
      />
      <AppointmentDetailsDialog
        appointment={selected}
        doctor={SEED_DOCTORS.find((d) => d.id === selected?.doctorId)}
        onClose={() => setSelected(null)}
        onStatus={reopen}
        onCancel={cancelAppointment}
        onPay={(a) => setPayingId(a.id)}
        onDelete={remove}
      />
    </div>
  );
}
