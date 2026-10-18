import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, CreditCard, Landmark, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form-field";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/types";
import { endTime, formatTime, fromKey, longDay, ordinal } from "./date-utils";
import { formatINR } from "./money";
import { createOrder, pay, type PaymentResult } from "./payment-service";
import type { Appointment, PaymentMethod } from "./types";

type Phase = "form" | "processing" | "success";

const digits = (s: string) => s.replace(/\D/g, "");
const formatCard = (s: string) => digits(s).slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (s: string) => {
  const d = digits(s).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function validateCard(card: { number: string; expiry: string; cvv: string; name: string }) {
  if (digits(card.number).length !== 16) return "Enter a valid 16-digit card number.";
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(card.expiry);
  if (!m) return "Enter the expiry as MM/YY.";
  const exp = new Date(2000 + Number(m[2]), Number(m[1]), 1); // first day after expiry month
  if (exp <= new Date()) return "This card has expired.";
  if (!/^\d{3,4}$/.test(card.cvv)) return "Enter the 3-digit CVV.";
  if (!card.name.trim()) return "Enter the name on the card.";
  return "";
}

function mmss(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function downloadReceipt(a: Appointment, doctor: Doctor | undefined, r: PaymentResult) {
  const d = fromKey(a.date);
  const lines = [
    "PAYMENT RECEIPT",
    "================",
    `Receipt no : ${r.receiptNo}`,
    `Payment id : ${r.paymentId}`,
    `Paid on    : ${new Date(r.paidAt).toLocaleString("en-IN")}`,
    `Method     : ${r.method}`,
    "",
    `Patient    : ${a.patient}`,
    `Doctor     : ${doctor?.name ?? "-"} (${doctor?.specialty ?? "-"})`,
    `Visit      : ${d.toDateString()}, ${formatTime(a.time)} - ${formatTime(endTime(a.time, a.durationMin))}`,
    `Reason     : ${a.reason || "-"}`,
    "",
    `Amount paid: ${formatINR(a.fee)}`,
    "",
    "(Test mode - no real payment was made.)",
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${r.receiptNo}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{children}</span>
    </div>
  );
}

interface BodyProps {
  appointment: Appointment;
  doctor: Doctor | undefined;
  onClose: () => void;
  onPaid: (id: string, result: PaymentResult) => void;
}

function PaymentBody({ appointment: a, doctor, onClose, onPaid }: BodyProps) {
  const [phase, setPhase] = useState<Phase>("form");
  const [method, setMethod] = useState<PaymentMethod>("Card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = a.holdExpiresAt ? a.holdExpiresAt - now : null;
  const expired = remaining !== null && remaining <= 0;
  const date = fromKey(a.date);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (expired) return;
    const problem =
      method === "Card"
        ? validateCard(card)
        : /^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())
          ? ""
          : "Enter a valid UPI ID, like name@bank.";
    if (problem) return setError(problem);

    setError("");
    setPhase("processing");
    try {
      const order = await createOrder(a.fee);
      const base = { orderId: order.orderId, amount: order.amount };
      const res = await pay(
        method === "Card" ? { ...base, method, card } : { ...base, method, upiId: upiId.trim() }
      );
      setResult(res);
      onPaid(a.id, res);
      setPhase("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setPhase("form");
    }
  };

  const setC = (k: keyof typeof card, v: string) => setCard((c) => ({ ...c, [k]: v }));

  return (
    <DialogContent
      className="gap-0 overflow-hidden p-0 sm:max-w-md [&>button]:text-slate-300 [&>button]:hover:text-white"
      onInteractOutside={(e) => phase === "processing" && e.preventDefault()}
      onEscapeKeyDown={(e) => phase === "processing" && e.preventDefault()}
    >
      <DialogHeader className="bg-slate-900 px-6 py-4 text-left text-white">
        <p className="text-[11px] font-semibold tracking-wider text-indigo-300 uppercase">
          {phase === "success" ? "Booking confirmed" : "Step 2 of 2 · Payment"}
        </p>
        <DialogTitle className="text-lg font-bold">
          {phase === "success" ? "Payment successful" : "Complete payment"}
        </DialogTitle>
        <DialogDescription className="sr-only">Pay the consultation fee to confirm your appointment.</DialogDescription>
      </DialogHeader>

      {phase === "processing" && (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <Loader2 className="size-8 animate-spin text-indigo-500" />
          <p className="font-semibold text-slate-800">Processing payment…</p>
          <p className="text-xs text-slate-500">Please don't close this window.</p>
        </div>
      )}

      {phase === "success" && result && (
        <div className="space-y-5 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="size-12 text-emerald-500" />
            <p className="text-2xl font-bold text-slate-900">{formatINR(a.fee)}</p>
            <p className="text-xs text-slate-500">
              Your appointment on {longDay(date)}, {ordinal(date.getDate())}{" "}
              {date.toLocaleDateString("en-US", { month: "short" })} at {formatTime(a.time)} is confirmed.
            </p>
          </div>
          <div className="space-y-2 rounded-lg bg-slate-50 p-4">
            <Row label="Receipt no">{result.receiptNo}</Row>
            <Row label="Payment id">{result.paymentId}</Row>
            <Row label="Method">{result.method}</Row>
            <Row label="Paid on">{new Date(result.paidAt).toLocaleString("en-IN")}</Row>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => downloadReceipt(a, doctor, result)}>
              Download receipt
            </Button>
            <Button className="flex-1 bg-indigo-500 text-white hover:bg-indigo-600" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      )}

      {phase === "form" && (
        <form onSubmit={submit} className="space-y-5 p-6">
          <div className="space-y-2 rounded-lg bg-slate-50 p-4">
            <Row label="Patient">{a.patient}</Row>
            <Row label="Doctor">{doctor ? `${doctor.name} · ${doctor.specialty}` : "—"}</Row>
            <Row label="When">
              {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, {formatTime(a.time)}
            </Row>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-sm font-semibold text-slate-700">Total</span>
              <span className="text-lg font-bold text-slate-900">{formatINR(a.fee)}</span>
            </div>
          </div>

          {remaining !== null && (
            <p
              className={cn(
                "rounded-md px-3 py-2 text-xs font-medium",
                expired ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
              )}
            >
              {expired ? "Your slot hold has expired. Please book again." : `Your slot is held for ${mmss(remaining)}`}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["Card", CreditCard],
                ["UPI", Landmark],
              ] as const
            ).map(([m, Icon]) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMethod(m);
                  setError("");
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
                  method === m
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                <Icon className="size-4" />
                {m === "Card" ? "Card" : "UPI"}
              </button>
            ))}
          </div>

          {method === "Card" ? (
            <div className="space-y-3">
              <FormField label="Card number" htmlFor="pmCard">
                <Input
                  id="pmCard"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="4242 4242 4242 4242"
                  value={card.number}
                  onChange={(e) => setC("number", formatCard(e.target.value))}
                  className="bg-slate-50"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Expiry" htmlFor="pmExp">
                  <Input
                    id="pmExp"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setC("expiry", formatExpiry(e.target.value))}
                    className="bg-slate-50"
                  />
                </FormField>
                <FormField label="CVV" htmlFor="pmCvv">
                  <Input
                    id="pmCvv"
                    inputMode="numeric"
                    type="password"
                    placeholder="•••"
                    value={card.cvv}
                    onChange={(e) => setC("cvv", digits(e.target.value).slice(0, 4))}
                    className="bg-slate-50"
                  />
                </FormField>
              </div>
              <FormField label="Name on card" htmlFor="pmName">
                <Input
                  id="pmName"
                  placeholder="As printed on the card"
                  value={card.name}
                  onChange={(e) => setC("name", e.target.value)}
                  className="bg-slate-50"
                />
              </FormField>
            </div>
          ) : (
            <FormField label="UPI ID" htmlFor="pmUpi">
              <Input
                id="pmUpi"
                placeholder="name@bank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="bg-slate-50"
              />
            </FormField>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-[11px] leading-snug text-slate-500">
            <ShieldCheck className="size-4 shrink-0 text-slate-400" />
            <span>
              <b>Test mode</b> — no real money is charged. Card 4242 4242 4242 4242 succeeds, 4000 0000 0000 0002
              is declined. For UPI, any id@bank works; include “fail” to simulate a failure.
            </span>
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Pay later
            </Button>
            <Button
              type="submit"
              disabled={expired}
              className="flex-1 bg-indigo-500 font-semibold text-white hover:bg-indigo-600"
            >
              Pay {formatINR(a.fee)}
            </Button>
          </div>
        </form>
      )}
    </DialogContent>
  );
}

interface PaymentDialogProps {
  /** The appointment to pay for. null keeps the dialog closed. */
  appointment: Appointment | null;
  doctor: Doctor | undefined;
  onClose: () => void;
  onPaid: (id: string, result: PaymentResult) => void;
}

export function PaymentDialog({ appointment, doctor, onClose, onPaid }: PaymentDialogProps) {
  return (
    <Dialog open={!!appointment} onOpenChange={(o) => !o && onClose()}>
      {appointment && (
        <PaymentBody key={appointment.id} appointment={appointment} doctor={doctor} onClose={onClose} onPaid={onPaid} />
      )}
    </Dialog>
  );
}
