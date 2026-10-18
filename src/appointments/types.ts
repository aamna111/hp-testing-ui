export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Refunded";
export type PaymentMethod = "Card" | "UPI";
export type CalendarView = "day" | "week" | "month";

export interface Appointment {
  id: string;
  patient: string;
  doctorId: string;
  /** Local date as YYYY-MM-DD */
  date: string;
  /** 24h time as HH:mm */
  time: string;
  durationMin: number;
  reason: string;
  status: AppointmentStatus;

  /** Consultation fee in INR, copied from the doctor when booked. */
  fee: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  receiptNo?: string;
  /** ISO timestamp */
  paidAt?: string;
  /** While payment is pending the slot is held until this time (epoch ms). */
  holdExpiresAt?: number;
}

/** What the booking form collects. */
export type AppointmentFormValues = Pick<
  Appointment,
  "patient" | "doctorId" | "date" | "time" | "durationMin" | "reason"
>;
