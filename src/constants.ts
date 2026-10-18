import type { DoctorFilters, DoctorFormValues, DoctorStatus } from "./types";

export const ALL = "all";

export const SPECIALTIES = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "General Surgery",
] as const;

export const STATUSES: DoctorStatus[] = ["Active", "On Leave", "Inactive"];

export const SHIFTS = [
  "Morning (08:00 - 16:00)",
  "Evening (14:00 - 22:00)",
  "Night Duty (22:00 - 06:00)",
  "On Call 24h",
] as const;

export const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594824813566-78a8717c181f?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
] as const;

export const DEFAULT_FILTERS: DoctorFilters = {
  search: "",
  specialty: ALL,
  status: ALL,
};

export const EMPTY_FORM_VALUES: DoctorFormValues = {
  name: "",
  specialty: "",
  department: "",
  email: "",
  phone: "",
  experience: "",
  consultationFee: "500",
  shift: SHIFTS[0],
  status: "Active",
  avatar: AVATAR_PRESETS[0],
};
