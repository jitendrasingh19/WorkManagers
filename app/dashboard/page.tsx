import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role || "member";

  const roleRedirectMap: Record<string, string> = {
    admin: "/dashboard/admin",
    manager: "/dashboard/manager",
    member: "/dashboard/member",
  };

  redirect(roleRedirectMap[role] || "/dashboard/member");
}