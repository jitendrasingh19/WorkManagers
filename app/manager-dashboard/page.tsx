import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function ManagerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return <h2>You must login first</h2>;
  if (session.user.role !== "manager") return <h2>Access denied: managers only</h2>;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Gym Manager</h2>

        <ul className="space-y-4">
          <li className="hover:text-gray-300 cursor-pointer">Dashboard</li>
          <li className="hover:text-gray-300 cursor-pointer">Members</li>
          <li className="hover:text-gray-300 cursor-pointer">Trainers</li>
          <li className="hover:text-gray-300 cursor-pointer">Plans</li>
          <li className="hover:text-gray-300 cursor-pointer">Attendance</li>
          <li className="hover:text-gray-300 cursor-pointer">Payments</li>
          <li className="hover:text-gray-300 cursor-pointer">Reports</li>
          <li className="hover:text-gray-300 cursor-pointer">Profile</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">
          Welcome {session.user.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Total Members</h3>
            <p className="text-2xl font-bold">250</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Today Attendance</h3>
            <p className="text-2xl font-bold">65</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Revenue</h3>
            <p className="text-2xl font-bold">₹45,000</p>
          </div>
        </div>
      </main>
    </div>
  );
}