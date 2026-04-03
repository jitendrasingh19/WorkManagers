import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return <h2>You must login first</h2>;

  return <div>Welcome {session.user.name}</div>;
}