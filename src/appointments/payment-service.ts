/**
 * MOCK payment service.
 *
 * Everything the UI needs from a payment provider goes through these three
 * functions, so swapping in the real thing later only touches this file:
 *
 *   createOrder -> POST /api/payments/create-order   (backend calls Razorpay/Stripe)
 *   pay         -> provider checkout (Razorpay Checkout / Stripe Elements),
 *                  then wait for the backend to confirm via webhook
 *   refund      -> POST /api/payments/refund
 *
 * Test inputs:
 *   card 4242 4242 4242 4242  -> succeeds
 *   card 4000 0000 0000 0002  -> declined
 *   UPI id containing "fail"  -> fails
 */
import type { PaymentMethod } from "./types";

/** How long a slot stays held while the payment is pending. */
export const HOLD_MINUTES = 10;

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export type PaymentRequest = { orderId: string; amount: number } & (
  | { method: "Card"; card: CardDetails }
  | { method: "UPI"; upiId: string }
);

export interface PaymentResult {
  paymentId: string;
  receiptNo: string;
  method: PaymentMethod;
  paidAt: string;
}

export class PaymentError extends Error {}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (len: number) =>
  Math.random().toString(36).slice(2, 2 + len).toUpperCase().padEnd(len, "0");

export async function createOrder(amount: number): Promise<{ orderId: string; amount: number }> {
  await wait(400);
  return { orderId: `order_${rand(10)}`, amount };
}

export async function pay(req: PaymentRequest): Promise<PaymentResult> {
  await wait(1800);

  if (req.method === "Card" && req.card.number.replace(/\s/g, "") === "4000000000000002") {
    throw new PaymentError("Your card was declined by the bank. Try another card.");
  }
  if (req.method === "UPI" && req.upiId.toLowerCase().includes("fail")) {
    throw new PaymentError("The UPI payment was not approved. Please try again.");
  }

  return {
    paymentId: `pay_${rand(12)}`,
    receiptNo: `RCPT-${Date.now().toString().slice(-7)}`,
    method: req.method,
    paidAt: new Date().toISOString(),
  };
}

export async function refund(paymentId: string): Promise<{ refundId: string }> {
  await wait(900);
  return { refundId: `rfnd_${paymentId.slice(4, 10)}${rand(4)}` };
}
