import { UserX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <UserX className="size-7" />
      </div>
      <h4 className="text-base font-semibold text-slate-700">No doctors found</h4>
      <p className="mt-1 text-xs text-slate-400">
        Try adjusting your filters or search terms.
      </p>
    </div>
  );
}
