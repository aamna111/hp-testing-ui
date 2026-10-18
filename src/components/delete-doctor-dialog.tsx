import { TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import type { Doctor } from "../types";

interface DeleteDoctorDialogProps {
  /** The doctor waiting to be removed. null keeps the dialog closed. */
  doctor: Doctor | null;
  onCancel: () => void;
  onConfirm: (doctor: Doctor) => void;
}

export function DeleteDoctorDialog({ doctor, onCancel, onConfirm }: DeleteDoctorDialogProps) {
  return (
    <AlertDialog open={!!doctor} onOpenChange={(open : any) => !open && onCancel()}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="items-center text-center sm:text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <TriangleAlert className="size-6" />
          </div>
          <AlertDialogTitle className="text-lg font-bold">
            Remove Doctor Record?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong className="text-slate-800">{doctor?.name}</strong> from the active
            system roster? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => doctor && onConfirm(doctor)}
            className="bg-rose-600 font-semibold text-white hover:bg-rose-700"
          >
            Yes, Remove Doctor
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
