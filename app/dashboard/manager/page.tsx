import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function ManagerDashboardPage() {
  // Fetch all members
  const { data: members } = await supabase
    .from("members")
    .select("*");

  // Count total
  const totalMembers = members?.length || 0;

  // Count active (IMPORTANT: matches your DB "Active")
  const activeMembers =
    members?.filter((m) => m.status === "Active").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your gym operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Active Members */}
        <Link href="/dashboard/manager/members?status=Active">
          <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900">Active Members</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {activeMembers}
            </p>
          </div>
        </Link>

        {/* Total Members */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Members</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {totalMembers}
          </p>
        </div>

        {/* Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Classes</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">--</p>
        </div>

      </div>
    </div>
  );
}