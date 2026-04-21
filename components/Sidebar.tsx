"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Dumbbell,
  Calendar,
  User,
  Settings,
} from "lucide-react";

type Role = "admin" | "manager" | "member";

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  const menuByRole = {
    admin: [
      { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Members", path: "/dashboard/admin/members", icon: Users },
      { name: "Payments", path: "/dashboard/admin/payments", icon: CreditCard },
      { name: "Trainers", path: "/dashboard/admin/trainers", icon: Dumbbell },
      { name: "Settings", path: "/dashboard/admin/settings", icon: Settings },
    ],
    manager: [
      { name: "Dashboard", path: "/dashboard/manager", icon: LayoutDashboard },
      { name: "Members", path: "/dashboard/manager/members", icon: Users },
      { name: "Attendance", path: "/dashboard/manager/attendance", icon: Calendar },
    ],
    member: [
      { name: "Dashboard", path: "/dashboard/member", icon: LayoutDashboard },
      { name: "Profile", path: "/dashboard/member/profile", icon: User },
      { name: "Payments", path: "/dashboard/member/payments", icon: CreditCard },
    ],
  };

  const menu = menuByRole[role] || [];

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <h2 className="text-xl font-bold text-blue-600">Gym Admin</h2>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-sm text-gray-500">
        © 2026 Gym System
      </div>
    </aside>
  );
}