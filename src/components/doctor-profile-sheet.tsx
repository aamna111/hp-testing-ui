import type { ComponentType, ReactNode } from "react";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Doctor } from "../types";
import { DoctorAvatar } from "./doctor-avatar";
import { StatusBadge } from "./status-badge";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase text-slate-400">{label}</span>
      <p className="text-sm font-medium text-slate-800">{children}</p>
    </div>
  );
}

function ContactLine({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <Icon className="size-4 text-slate-400" />
      <span>{children}</span>
    </div>
  );
}

interface DoctorProfileSheetProps {
  /** The doctor to show. null keeps the panel closed. */
  doctor: Doctor | null;
  onClose: () => void;
}

export function DoctorProfileSheet({ doctor, onClose }: DoctorProfileSheetProps) {
  return (
    <Sheet open={!!doctor} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col justify-between gap-0 p-0 sm:max-w-md [&>button]:text-slate-300 [&>button]:hover:text-white"
      >
        {doctor && (
          <>
            <div>
              <SheetHeader className="bg-slate-900 p-6 text-left text-white">
                <div className="flex items-center gap-4">
                  <DoctorAvatar
                    name={doctor.name}
                    src={doctor.avatar}
                    className="size-16 ring-2 ring-sky-500"
                  />
                  <div>
                    <SheetTitle className="text-lg font-bold text-white">
                      {doctor.name}
                    </SheetTitle>
                    <SheetDescription className="text-xs font-medium text-sky-400">
                      {doctor.specialty}
                    </SheetDescription>
                    <StatusBadge
                      status={doctor.status}
                      variant="solid"
                      className="mt-1 px-2 py-0.5 text-[10px] font-bold"
                    />
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-4 p-6">
                <Detail label="Department">
                  {doctor.department || "General Department"}
                </Detail>
                <div className="grid grid-cols-2 gap-4">
                  <Detail label="Experience">{doctor.experience} Years</Detail>
                  <Detail label="Shift Schedule">{doctor.shift}</Detail>
                </div>
                <Detail label="Consultation Fee">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(doctor.consultationFee)}
                </Detail>
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <ContactLine icon={Mail}>{doctor.email}</ContactLine>
                  <ContactLine icon={Phone}>{doctor.phone}</ContactLine>
                </div>
              </div>
            </div>

            <SheetFooter className="border-t border-slate-100 bg-slate-50 p-6">
              <SheetClose asChild>
                <Button variant="secondary" className="w-full font-semibold">
                  Close Profile
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
