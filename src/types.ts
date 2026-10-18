export type DoctorStatus = "Active" | "On Leave" | "Inactive";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  email: string;
  phone: string;
  experience: number;
  /** Consultation fee in INR. */
  consultationFee: number;
  shift: string;
  status: DoctorStatus;
  avatar: string;
}

/** Form values: experience stays a string while the user is typing. */
export type DoctorFormValues = Omit<Doctor, "id" | "experience" | "consultationFee"> & {
  experience: string;
  consultationFee: string;
};

export type DoctorsView = "table" | "grid";

export interface DoctorFilters {
  search: string;
  specialty: string; // "all" or a specialty
  status: string; // "all" or a DoctorStatus
}

export interface DoctorStats {
  total: number;
  active: number;
  onLeave: number;
  departments: number;
  activePercent: number;
}

/** Shared by the table, the cards and anything else that lists doctors. */
export interface DoctorActionHandlers {
  onView: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}
