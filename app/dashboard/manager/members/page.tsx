import MemberCard from "@/components/managers/MemberCard";
import { supabase } from "@/lib/supabaseClient";

export default async function MembersPage({ searchParams }: any) {
  const status = searchParams?.status || "Active";

  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .eq("status", status);

  if (error) {
    console.error(error);
    return <div>Error loading members</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{status} Members</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members?.length > 0 ? (
          members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))
        ) : (
          <p>No members found</p>
        )}
      </div>
    </div>
  );
}