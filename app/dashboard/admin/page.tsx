'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import { Users, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  const [members, setMembers] = useState<any[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [expiringSubscriptions, setExpiringSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // ✅ Recent members (last 7 days)
  const recentMembers = members.filter((m) => {
    if (!m.created_at) return false;

    const diffDays =
      (Date.now() - new Date(m.created_at).getTime()) /
      (1000 * 3600 * 24);

    return diffDays <= 7;
  });

  // ✅ Fetch Members
  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    setMembers(data || []);
  };

  // ✅ Get member name
  const getMemberName = (memberId: string) => {
    return members.find((m) => m.id === memberId)?.name || "Unknown Member";
  };

  // ✅ Calculate expiry
  const calculateDaysUntilExpiry = (paymentDate: string, duration: string) => {
    const endDate = new Date(paymentDate);

    const durationMap: any = {
      "1 Month": 1,
      "3 Months": 3,
      "6 Months": 6,
      "1 Year": 12,
    };

    endDate.setMonth(endDate.getMonth() + (durationMap[duration] || 1));

    return Math.ceil((endDate.getTime() - Date.now()) / (1000 * 3600 * 24));
  };

  // ✅ Expiring subscriptions
  const fetchExpiringSubscriptions = async () => {
    const { data } = await supabase
      .from("payments")
      .select("id, member_id, date, duration, plan, status")
      .eq("status", "paid")
      .order("date", { ascending: false });

    if (!data) return;

    const latest: any = {};

    data.forEach((p) => {
      if (!latest[p.member_id]) latest[p.member_id] = p;
    });

    const expiring = Object.values(latest)
      .map((p: any) => ({
        ...p,
        daysRemaining: calculateDaysUntilExpiry(p.date, p.duration),
      }))
      .filter((p: any) => p.daysRemaining <= 10 && p.daysRemaining > 0)
      .sort((a: any, b: any) => a.daysRemaining - b.daysRemaining);

    setExpiringSubscriptions(expiring);
  };

  // ✅ Count
  const fetchCount = async () => {
    const { count } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true });

    setTotalMembers(count || 0);

    const { count: trainerCount } = await supabase
      .from("trainers")
      .select("*", { count: "exact", head: true });

    setTotalTrainers(trainerCount || 0);
  };

  // ✅ Realtime + Initial Load
  useEffect(() => {
    if (!session?.user) return;

    setLoading(true);

    Promise.all([
      fetchMembers(),
      fetchCount(),
      fetchExpiringSubscriptions(),
    ]).finally(() => setLoading(false));

    const channel = supabase
      .channel("realtime-members")

      // ✅ MEMBER INSERT
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "members" },
        (payload) => {
          console.log("REALTIME FIRED ✅", payload);

          const newMember = payload.new as any;

          toast.success(`🎉 ${newMember.name || "New Member"} joined!`);

          setMembers((prev) => {
            console.log('Adding member', newMember);
            console.log('Prev members', prev);
            return [newMember, ...prev];
          });
          setTotalMembers((prev) => prev + 1);
        }
      )

      // ✅ PAYMENT UPDATE
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => fetchExpiringSubscriptions()
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  // ✅ UI
  return (
    <div className="space-y-8 p-6">

      {/* Expiring Alerts */}
      {expiringSubscriptions.length > 0 && (
        <div className="bg-orange-50 p-6 rounded-2xl border">
          <div className="flex gap-3">
            <AlertCircle className="text-orange-600" />
            <div>
              <h3 className="font-bold mb-2">
                {expiringSubscriptions.length} Expiring (≤ 10 days)
              </h3>

              {expiringSubscriptions.map((sub: any) => (
                <div key={sub.id} className="flex justify-between text-sm py-2">
                  <span>{getMemberName(sub.member_id)}</span>
                  <span className="text-red-600 font-semibold">
                    {sub.daysRemaining} days
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div
          onClick={() => router.push("/dashboard/admin/members")}
          className="p-6 bg-white rounded-2xl border cursor-pointer"
        >
          <Users />
          <p className="mt-4">Members</p>
          <h2 className="text-3xl font-bold">{totalMembers}</h2>
        </div>

        <div
          onClick={() => router.push("/dashboard/admin/trainers")}
          className="p-6 bg-white rounded-2xl border cursor-pointer"
        >
          <Users />
          <p className="mt-4">Trainers</p>
          <h2 className="text-3xl font-bold">{totalTrainers}</h2>
        </div>
      </div>

      {/* Recent */}
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="font-bold">Recent Signups</h3>

        {recentMembers.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {recentMembers.slice(0, 5).map((user) => (
              <li key={user.id}>
                {user.name} - {new Date(user.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No recent signups</p>
        )}
      </div>

    </div>
  );
}