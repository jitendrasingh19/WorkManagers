import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Sidebar from "@/components/Sidebar";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/member/login");
  }

  if (session.user.role !== "member") {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="member" />

      <div className="flex flex-col flex-1">
        <header className="h-16 border-b bg-white flex items-center px-8 justify-between">
          <h1 className="font-semibold capitalize">Member Dashboard</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}