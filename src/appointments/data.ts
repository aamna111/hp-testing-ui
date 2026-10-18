import { SEED_DOCTORS } from "@/data";
import { addDays, toKey } from "./date-utils";
import type { Appointment, AppointmentStatus } from "./types";

// [day offset from today, time, duration, patient, doctorId, reason]
const SEED: [number, string, number, string, string, string][] = [
  [-9, "09:00", 30, "Anita Verma", "d1", "Chest pain follow-up"],
  [-9, "11:30", 30, "Rohan Mehta", "d4", "Knee pain"],
  [-6, "10:00", 45, "Sara Khan", "d3", "Child vaccination"],
  [-4, "15:00", 30, "Imran Ali", "d2", "Recurring headaches"],
  [-4, "16:00", 30, "Neha Gupta", "d5", "Skin allergy"],
  [-2, "09:30", 30, "David Lee", "d1", "ECG review"],
  [0, "09:00", 30, "Meera Joshi", "d1", "Blood pressure check"],
  [0, "10:30", 45, "Karan Singh", "d4", "Post-surgery check"],
  [0, "14:00", 30, "Fatima Noor", "d2", "MRI results"],
  [1, "09:30", 30, "Vikram Rao", "d3", "Fever and cough"],
  [1, "11:00", 30, "Pooja Nair", "d5", "Acne treatment"],
  [2, "10:00", 60, "Arjun Kapoor", "d4", "Physiotherapy plan"],
  [3, "13:30", 30, "Lena Fischer", "d1", "Annual heart check"],
  [3, "15:00", 30, "Rahul Das", "d2", "Dizziness"],
  [3, "16:30", 30, "Zoya Sheikh", "d3", "Growth check"],
  [5, "09:00", 30, "Tom Baker", "d4", "Shoulder pain"],
  [6, "12:00", 30, "Isha Patel", "d5", "Mole screening"],
  [8, "10:00", 45, "Dev Malhotra", "d1", "Stress test"],
  [8, "11:30", 30, "Ayesha Rahman", "d2", "Migraine consultation"],
  [10, "14:30", 30, "Nikhil Jain", "d3", "Allergy review"],
  [13, "09:30", 30, "Sunita Devi", "d4", "Hip pain"],
  [15, "11:00", 30, "Omar Farooq", "d1", "Cholesterol review"],
];

/** Seed rows that are still waiting for payment (to demo the pending state). */
const PENDING_SEEDS = new Set([10, 14]);

export function buildSeedAppointments(today = new Date()): Appointment[] {
  return SEED.map(([offset, time, durationMin, patient, doctorId, reason], i) => {
    const status: AppointmentStatus =
      offset < 0 ? (i % 5 === 4 ? "Cancelled" : "Completed") : "Scheduled";
    const fee = SEED_DOCTORS.find((d) => d.id === doctorId)?.consultationFee ?? 0;
    const date = toKey(addDays(today, offset));
    const base = { id: `a${i + 1}`, patient, doctorId, date, time, durationMin, reason, status, fee };

    if (PENDING_SEEDS.has(i)) {
      return { ...base, paymentStatus: "Pending" as const, holdExpiresAt: Date.now() + 30 * 60_000 };
    }
    const paid = {
      ...base,
      paymentMethod: i % 2 ? ("UPI" as const) : ("Card" as const),
      paymentId: `pay_SEED${1000 + i}`,
      receiptNo: `RCPT-${1000 + i}`,
      paidAt: new Date(`${date}T08:00:00`).toISOString(),
    };
    return { ...paid, paymentStatus: status === "Cancelled" ? ("Refunded" as const) : ("Paid" as const) };
  });
}
