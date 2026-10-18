import { cn } from "@/lib/utils";
import { AppointmentChip, PAYMENT_LABEL, chipStyle } from "./chip";
import {
  WEEKDAYS,
  addDays,
  endTime,
  formatTime,
  isSameDay,
  monthGrid,
  startOfWeek,
  toKey,
} from "./date-utils";
import { formatINR } from "./money";
import type { Appointment } from "./types";

type ByDate = Map<string, Appointment[]>;

interface CommonProps {
  cursor: Date;
  byDate: ByDate;
  onSelect: (a: Appointment) => void;
  onAddOn: (dateKey: string) => void;
  doctorName: (id: string) => string;
}

const MAX_CHIPS = 3;

export function MonthView({
  cursor,
  byDate,
  onSelect,
  onAddOn,
  onOpenDay,
}: Omit<CommonProps, "doctorName"> & { onOpenDay: (d: Date) => void }) {
  const days = monthGrid(cursor);
  const today = new Date();

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-slate-100">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-3 py-2.5 text-xs font-semibold text-slate-500">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = toKey(day);
          const items = byDate.get(key) ?? [];
          const inMonth = day.getMonth() === cursor.getMonth();
          const isToday = isSameDay(day, today);
          return (
            <div
              key={key}
              onClick={() => onAddOn(key)}
              className={cn(
                "group relative flex min-h-[132px] cursor-pointer flex-col gap-1 border-b border-r border-slate-100 p-1.5 pb-9 transition-colors hover:bg-indigo-50/40",
                !inMonth && "bg-slate-50/50"
              )}
            >
              <div className="flex flex-col gap-1">
                {items.slice(0, MAX_CHIPS).map((a) => (
                  <AppointmentChip key={a.id} appointment={a} onClick={onSelect} />
                ))}
                {items.length > MAX_CHIPS && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDay(day);
                    }}
                    className="px-1 text-left text-[10.5px] font-semibold text-indigo-500 hover:underline"
                  >
                    +{items.length - MAX_CHIPS} more
                  </button>
                )}
              </div>
              <span
                className={cn(
                  "absolute right-2 bottom-1.5 flex size-7 items-center justify-center rounded-full text-sm tabular-nums",
                  inMonth ? "text-slate-600" : "text-slate-300",
                  isToday && "bg-indigo-500 font-bold text-white"
                )}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WeekView({ cursor, byDate, onSelect, onAddOn, doctorName }: CommonProps) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const today = new Date();

  return (
    <div className="grid grid-cols-7">
      {days.map((day, i) => {
        const key = toKey(day);
        const items = byDate.get(key) ?? [];
        const isToday = isSameDay(day, today);
        return (
          <div
            key={key}
            onClick={() => onAddOn(key)}
            className="min-h-[420px] cursor-pointer border-r border-slate-100 p-2 transition-colors hover:bg-indigo-50/30"
          >
            <div className="mb-3 flex items-baseline justify-between px-1">
              <span className="text-xs font-semibold text-slate-500">{WEEKDAYS[i]}</span>
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-sm tabular-nums text-slate-700",
                  isToday && "bg-indigo-500 font-bold text-white"
                )}
              >
                {day.getDate()}
              </span>
            </div>
            <div className="space-y-1.5">
              {items.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(a);
                  }}
                  className={cn(
                    "block w-full rounded-lg px-2.5 py-2 text-left transition-colors",
                    chipStyle(a)
                  )}
                >
                  <span className="block text-[10px] font-medium opacity-80">
                    {formatTime(a.time)}
                  </span>
                  <span className="block truncate text-xs font-bold">{a.patient}</span>
                  <span className="block truncate text-[10px] opacity-80">
                    {doctorName(a.doctorId)}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] font-semibold">
                    {formatINR(a.fee)} · {PAYMENT_LABEL[a.paymentStatus]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i); // 08:00 – 19:00

export function DayView({ cursor, byDate, onSelect, onAddOn, doctorName }: CommonProps) {
  const key = toKey(cursor);
  const items = byDate.get(key) ?? [];

  return (
    <div>
      {HOURS.map((h) => {
        const slot = items.filter((a) => Number(a.time.slice(0, 2)) === h);
        const label = formatTime(`${String(h).padStart(2, "0")}:00`);
        return (
          <div key={h} className="flex min-h-[64px] border-b border-slate-100">
            <div className="w-24 shrink-0 border-r border-slate-100 px-4 py-3 text-xs font-medium text-slate-400">
              {label}
            </div>
            <div
              onClick={() => onAddOn(key)}
              className="flex flex-1 cursor-pointer flex-wrap gap-2 p-2 transition-colors hover:bg-indigo-50/30"
            >
              {slot.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(a);
                  }}
                  className={cn(
                    "min-w-[220px] rounded-lg px-3 py-2 text-left transition-colors",
                    chipStyle(a)
                  )}
                >
                  <span className="block text-[11px] font-medium opacity-80">
                    {formatTime(a.time)} – {formatTime(endTime(a.time, a.durationMin))}
                  </span>
                  <span className="block text-sm font-bold">{a.patient}</span>
                  <span className="block text-xs opacity-80">
                    {doctorName(a.doctorId)} · {a.reason}
                  </span>
                  <span className="block text-[11px] font-semibold">
                    {formatINR(a.fee)} · {PAYMENT_LABEL[a.paymentStatus]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
