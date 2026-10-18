import { useState, useEffect, useCallback } from "react";
import { Doctor, DoctorFormData } from "../types";
import { doctorApi } from "../api/doctorApi";

export const useDoctors = (addToast: (msg: string, type: "success" | "error" | "info") => void) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await doctorApi.getAll();
      setDoctors(data);
    } catch {
      addToast("Failed to fetch doctors. Check if the server is running.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const createDoctor = async (formData: DoctorFormData) => {
    try {
      const newDoctor = await doctorApi.create(formData);
      setDoctors((prev) => [...prev, newDoctor]);
      addToast("Doctor added successfully!", "success");
      return true;
    } catch {
      addToast("Failed to create doctor.", "error");
      return false;
    }
  };

  const updateDoctor = async (id: number, formData: DoctorFormData) => {
    try {
      const updated = await doctorApi.update(id, formData);
      setDoctors((prev) => prev.map((d) => (d.id === id ? updated : d)));
      addToast("Doctor updated successfully!", "success");
      return true;
    } catch {
      addToast("Failed to update doctor.", "error");
      return false;
    }
  };

  const deleteDoctor = async (id: number) => {
    try {
      await doctorApi.delete(id);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
      addToast("Doctor removed successfully.", "success");
    } catch {
      addToast("Failed to delete doctor.", "error");
    }
  };

  const searchDoctors = async (name: string, specialization: string) => {
    if (!name.trim() && !specialization.trim()) {
      fetchDoctors();
      return;
    }
    setSearchLoading(true);
    try {
      const results = await doctorApi.search(name, specialization);
      setDoctors(results);
    } catch {
      addToast("Search failed.", "error");
    } finally {
      setSearchLoading(false);
    }
  };

  return { doctors, loading, searchLoading, createDoctor, updateDoctor, deleteDoctor, searchDoctors, fetchDoctors };
};
