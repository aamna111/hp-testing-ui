import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ALL, SPECIALTIES, STATUSES } from "@/constants";
import type { DoctorFilters, DoctorsView } from "../types";

interface DoctorsToolbarProps {
  filters: DoctorFilters;
  onFiltersChange: (patch: Partial<DoctorFilters>) => void;
  onReset: () => void;
  view: DoctorsView;
  onViewChange: (view: DoctorsView) => void;
}

export function DoctorsToolbar({
  filters,
  onFiltersChange,
  onReset,
  view,
  onViewChange,
}: DoctorsToolbarProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            placeholder="Search name, specialty, or email..."
            className="bg-slate-50 pl-9"
          />
        </div>

        <Select
          value={filters.specialty}
          onValueChange={(specialty) => onFiltersChange({ specialty })}
        >
          <SelectTrigger className="w-[170px] bg-slate-50">
            <SelectValue placeholder="All Specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Specialties</SelectItem>
            {SPECIALTIES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(status) => onFiltersChange({ status })}
        >
          <SelectTrigger className="w-[150px] bg-slate-50">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="link"
          size="sm"
          onClick={onReset}
          className="px-2 text-xs text-slate-500 hover:text-slate-800"
        >
          Reset
        </Button>
      </div>

      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(v) => v && onViewChange(v as DoctorsView)}
        className="self-end rounded-lg border border-slate-200 bg-slate-50 p-1 lg:self-auto"
      >
        <ToggleGroupItem
          value="table"
          aria-label="Table view"
          className="gap-2 text-xs font-semibold data-[state=on]:bg-white data-[state=on]:shadow-sm"
        >
          <List className="size-4" />
          <span className="hidden sm:inline">Table</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="grid"
          aria-label="Cards grid view"
          className="gap-2 text-xs font-semibold data-[state=on]:bg-white data-[state=on]:shadow-sm"
        >
          <LayoutGrid className="size-4" />
          <span className="hidden sm:inline">Cards Grid</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
