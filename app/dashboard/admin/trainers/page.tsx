import Link from "next/link";
// import { GetServerSideProps } from "next";
import { getTrainers, getTrainerStats, Trainer, TrainerStats } from "@/lib/trainers";
import TrainerTable from "@/components/trainers/TrainerTable";
import TrainerFilters from "@/components/trainers/TrainerFilters";
import TrainerStatsComponent from "@/components/trainers/TrainerStats";
interface Props {
  trainers: Trainer[];
  stats: TrainerStats;
}

export default async function TrainersPage({ searchParams }: any) {
  const filters = {
    q: searchParams.q || "",
    status: searchParams.status || "",
    spec: searchParams.spec || "",
    sort: searchParams.sort || "name",
    
  };
  

  const [trainers, stats] = await Promise.all([
    getTrainers(filters),
    getTrainerStats(),
  ]);  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your gym's trainer roster, schedules, and performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Export CSV
            </button>
            <Link
              href="/dashboard/admin/trainers/new"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              + Add trainer
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <TrainerStatsComponent stats={stats} />
        </div>

        {/* Tab Nav */}
        <div className="mb-6 flex gap-1 border-b border-gray-200">
          {[
            { label: "All trainers",  href: "/dashboard/admin/trainers" },
            // { label: "Schedule",      href: "/dashboard/admin/trainers/schedule" },
            // { label: "Assignments",   href: "/dashboard/admin/trainers/assignments" },
            // { label: "Performance",   href: "/dashboard/admin/trainers/performance" },
            // { label: "Documents",     href: "/dashboard/admin/trainers/documents" },
          ].map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab.label === "All trainers"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4">
          <TrainerFilters />
        </div>

        {/* Result count */}
        <p className="mb-3 text-xs text-gray-400">
          Showing {trainers.length} trainer{trainers.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <TrainerTable trainers={trainers} />
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const filters = {
//     q:      (query.q as string)      || "",
//     status: (query.status as string) || "",
//     spec:   (query.spec as string)   || "",
//     sort:   (query.sort as string)   || "name",
//   };

//   const [trainers, stats] = await Promise.all([
//     getTrainers(filters),
//     getTrainerStats(),
//   ]);

//   return {
//     props: { trainers, stats },
//   };
// };