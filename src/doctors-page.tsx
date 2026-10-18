import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteDoctorDialog } from "./components/delete-doctor-dialog";
import { DoctorFormDialog } from "./components/doctor-form-dialog";
import { DoctorProfileSheet } from "./components/doctor-profile-sheet";
import { DoctorsGrid } from "./components/doctors-grid";
import { DoctorsStats } from "./components/doctors-stats";
import { DoctorsTable } from "./components/doctors-table";
import { DoctorsToolbar } from "./components/doctors-toolbar";
import { PageHeader } from "./components/page-header";
import { useDoctors } from "./hooks/use-doctors";
import type { Doctor, DoctorActionHandlers, DoctorsView } from "./types";

interface DoctorsPageProps {
  /** Optional. Defaults to the 5 doctors in data.ts. */
  initialDoctors?: Doctor[];
}

export default function DoctorsPage({ initialDoctors }: DoctorsPageProps) {
  const {
    filteredDoctors,
    stats,
    filters,
    updateFilters,
    resetFilters,
    saveDoctor,
    removeDoctor,
  } = useDoctors(initialDoctors);

  const [view, setView] = useState<DoctorsView>("table");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [deleting, setDeleting] = useState<Doctor | null>(null);
  const [viewing, setViewing] = useState<Doctor | null>(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handlers: DoctorActionHandlers = {
    onView: setViewing,
    onEdit: (doctor) => {
      setEditing(doctor);
      setFormOpen(true);
    },
    onDelete: setDeleting,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Management"
        description="Manage hospital staff credentials, schedules, active duty status, and department rosters."
        action={
          <Button onClick={openAdd} className="bg-sky-600 font-semibold hover:bg-sky-700">
            <Plus className="size-3.5" />
            Add Doctor
          </Button>
        }
      />

      <DoctorsStats stats={stats} />

      <DoctorsToolbar
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
        view={view}
        onViewChange={setView}
      />

      {view === "table" ? (
        <DoctorsTable doctors={filteredDoctors} {...handlers} />
      ) : (
        <DoctorsGrid doctors={filteredDoctors} {...handlers} />
      )}

      <DoctorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        doctor={editing}
        onSubmit={saveDoctor}
      />

      <DeleteDoctorDialog
        doctor={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={(doctor) => {
          removeDoctor(doctor.id);
          setDeleting(null);
        }}
      />

      <DoctorProfileSheet doctor={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
