import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function MemberDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return <h2>You must login first</h2>;

  return (
    <div>
      <h1>Member Dashboard</h1>
      <p>Welcome {session.user.name}</p>
      {/* Add member-specific content here */}
    </div>
  );
}