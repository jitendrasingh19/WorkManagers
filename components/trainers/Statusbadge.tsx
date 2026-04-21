import { TrainerStatus } from "@/lib/trainers";

const statusConfig: Record<
  TrainerStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-600",
  },
  on_leave: {
    label: "On Leave",
    className: "bg-amber-100 text-amber-800",
  },
};

export default function StatusBadge({ status }: { status: TrainerStatus }) {
  const { label, className } = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}