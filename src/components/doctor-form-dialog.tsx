import { useEffect, useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";
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
import {
  AVATAR_PRESETS,
  EMPTY_FORM_VALUES,
  SHIFTS,
  SPECIALTIES,
  STATUSES,
} from "@/constants";
import type { Doctor, DoctorFormValues, DoctorStatus } from "../types";
import { AvatarPicker } from "./avatar-picker";
import { FormField } from "./form-field";

const toFormValues = (doctor: Doctor | null): DoctorFormValues =>
  doctor
    ? {
        ...doctor,
        experience: String(doctor.experience),
        consultationFee: String(doctor.consultationFee),
      }
    : EMPTY_FORM_VALUES;

interface DoctorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a doctor to edit, or null to add a new one. */
  doctor: Doctor | null;
  onSubmit: (values: DoctorFormValues, id?: string) => void;
}

export function DoctorFormDialog({
  open,
  onOpenChange,
  doctor,
  onSubmit,
}: DoctorFormDialogProps) {
  const [values, setValues] = useState<DoctorFormValues>(toFormValues(doctor));

  // Start from the right values every time the dialog opens.
  useEffect(() => {
    if (open) setValues(toFormValues(doctor));
  }, [open, doctor]);

  const set = <K extends keyof DoctorFormValues>(key: K, value: DoctorFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.specialty) return;
    onSubmit(values, doctor?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl [&>button]:text-slate-300 [&>button]:hover:text-white">
        <DialogHeader className="bg-slate-900 px-6 py-4 text-left text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sky-600">
              <UserPlus className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold">
              {doctor ? "Edit Doctor Details" : "Add New Doctor"}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Fill in the doctor's details and save the record.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Full Name *" htmlFor="docName">
              <Input
                id="docName"
                required
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Dr. Alexander Wright"
                className="bg-slate-50"
              />
            </FormField>

            <FormField label="Specialty *">
              <Select value={values.specialty} onValueChange={(v) => set("specialty", v)}>
                <SelectTrigger className="w-full bg-slate-50">
                  <SelectValue placeholder="Select Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Department" htmlFor="docDepartment">
              <Input
                id="docDepartment"
                value={values.department}
                onChange={(e) => set("department", e.target.value)}
                placeholder="e.g. Cardiovascular Science"
                className="bg-slate-50"
              />
            </FormField>

            <FormField label="Email Address *" htmlFor="docEmail">
              <Input
                id="docEmail"
                type="email"
                required
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="a.wright@apexhealth.org"
                className="bg-slate-50"
              />
            </FormField>

            <FormField label="Phone Number *" htmlFor="docPhone">
              <Input
                id="docPhone"
                required
                value={values.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="bg-slate-50"
              />
            </FormField>

            <FormField label="Experience (Years)" htmlFor="docExperience">
              <Input
                id="docExperience"
                type="number"
                min={0}
                max={50}
                value={values.experience}
                onChange={(e) => set("experience", e.target.value)}
                placeholder="10"
                className="bg-slate-50"
              />
            </FormField>

            <FormField label="Working Shift">
              <Select value={values.shift} onValueChange={(v) => set("shift", v)}>
                <SelectTrigger className="w-full bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHIFTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Duty Status">
              <Select
                value={values.status}
                onValueChange={(v) => set("status", v as DoctorStatus)}
              >
                <SelectTrigger className="w-full bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Consultation Fee (₹)" htmlFor="docFee">
              <Input
                id="docFee"
                type="number"
                min={0}
                step={50}
                value={values.consultationFee}
                onChange={(e) => set("consultationFee", e.target.value)}
                placeholder="500"
                className="bg-slate-50"
              />
            </FormField>
          </div>

          <FormField label="Profile Photo Choice">
            <AvatarPicker
              value={values.avatar}
              options={AVATAR_PRESETS}
              onChange={(url) => set("avatar", url)}
            />
          </FormField>

          <DialogFooter className="border-t border-slate-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!values.specialty}
              className="bg-sky-600 font-semibold hover:bg-sky-700"
            >
              Save Doctor Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
