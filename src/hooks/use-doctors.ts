import { useCallback, useMemo, useState } from "react";
import { ALL, DEFAULT_FILTERS } from "@/constants";
import { SEED_DOCTORS } from "@/data";
import type {
  Doctor,
  DoctorFilters,
  DoctorFormValues,
  DoctorStats,
} from "../types";

/**
 * All doctor data logic lives here: list, filters, stats, add/edit/remove.
 * The UI components only receive plain props, so when you connect an API or
 * a Zustand store later, this is the only file that needs to change.
 */
export function useDoctors(initialDoctors: Doctor[] = SEED_DOCTORS) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [filters, setFilters] = useState<DoctorFilters>(DEFAULT_FILTERS);

  const filteredDoctors = useMemo(() => {
    const q = filters.search.toLowerCase();
    return doctors.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q);
      const matchesSpecialty =
        filters.specialty === ALL || d.specialty === filters.specialty;
      const matchesStatus = filters.status === ALL || d.status === filters.status;
      return matchesSearch && matchesSpecialty && matchesStatus;
    });
  }, [doctors, filters]);

  const stats = useMemo<DoctorStats>(() => {
    const total = doctors.length;
    const active = doctors.filter((d) => d.status === "Active").length;
    const onLeave = doctors.filter((d) => d.status === "On Leave").length;
    const departments = new Set(doctors.map((d) => d.specialty)).size;
    return {
      total,
      active,
      onLeave,
      departments,
      activePercent: total > 0 ? Math.round((active / total) * 100) : 0,
    };
  }, [doctors]);

  const updateFilters = useCallback(
    (patch: Partial<DoctorFilters>) => setFilters((prev) => ({ ...prev, ...patch })),
    []
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  /** Pass an id to update an existing doctor, omit it to add a new one. */
  const saveDoctor = useCallback((values: DoctorFormValues, id?: string) => {
    const record: Doctor = {
      ...values,
      id: id ?? `doc-${Date.now()}`,
      experience: Number(values.experience) || 0,
      consultationFee: Number(values.consultationFee) || 0,
    };
    setDoctors((prev) =>
      id ? prev.map((d) => (d.id === id ? record : d)) : [record, ...prev]
    );
  }, []);

  const removeDoctor = useCallback((id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return {
    filteredDoctors,
    stats,
    filters,
    updateFilters,
    resetFilters,
    saveDoctor,
    removeDoctor,
  };
}
