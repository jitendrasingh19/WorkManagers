function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function TrainerStats({ stats }: { stats: any }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        label="Total trainers"
        value={stats.total}
      />
      <StatCard
        label="Active"
        value={stats.active}
        sub={`${Math.round((stats.active / stats.total) * 100)}% of roster`}
      />
      <StatCard
        label="Inactive"
        value={stats.inactive}
      />
      <StatCard
        label="Avg rating"
        value={stats.avgRating?.toFixed(1) || "—"}
      />
    </div>
  );
}