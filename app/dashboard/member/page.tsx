"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, Calendar, Flame, User } from "lucide-react";
import bcrypt from "bcryptjs";

export default function MemberDashboardPage() {
  const { data: session, status } = useSession();
  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalSessions: 0, streak: 0 });

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    console.log("Session status:", status, "Session:", session);
    if (status === 'loading') {
      return; // Wait for session to load
    }

    if (status === 'unauthenticated') {
      console.log("User is not authenticated");
      if (mountedRef.current) setLoading(false);
      return;
    }

    if (session?.user?.email) {
      fetchData();
    } else {
      if (mountedRef.current) setLoading(false);
    }
  }, [session?.user?.email, status]); // Include status in dependencies

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        if (mountedRef.current) {
          console.warn("Loading timeout reached, forcing loading to false");
          setLoading(false);
        }
      }, 10000); // 10 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Calculate next payment date based on member's plan
  const calculateNextPaymentDate = (member: any) => {
    console.log("Calculating payment date for member:", member);
    console.log("Member created_at:", member?.created_at);
    console.log("Member plan:", member?.plan);

    if (!member?.created_at) {
      console.warn("No created_at date found, using today as start date");
      // Fallback to today if no created_at
      const today = new Date();
      const next = new Date(today);
      next.setMonth(next.getMonth() + 1); // Default to 1 month
      return next;
    }

    const start = new Date(member.created_at);
    const next = new Date(start);

    // Normalize plan string (lowercase and trim)
    const planLower = (member.plan || "").toLowerCase().trim();
    console.log("Normalized plan:", planLower);

    // Adjust based on your plan
    if (planLower.includes("monthly") || planLower === "basic") {
      next.setMonth(next.getMonth() + 1);
      console.log("Using monthly plan: +1 month");
    } else if (planLower.includes("quarterly")) {
      next.setMonth(next.getMonth() + 3);
      console.log("Using quarterly plan: +3 months");
    } else if (planLower.includes("yearly") || planLower.includes("annual")) {
      next.setFullYear(next.getFullYear() + 1);
      console.log("Using yearly plan: +1 year");
    } else {
      // Fallback to 1 month if plan is unknown
      console.warn("Unknown plan:", member.plan, "- defaulting to 1 month");
      next.setMonth(next.getMonth() + 1);
    }

    console.log("Calculated next payment date:", next);
    return next;
  };

  const getRemainingDays = (date: Date | null) => {
    if (!date) return "N/A";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paymentDate = new Date(date);
    paymentDate.setHours(0, 0, 0, 0);
    
    const diff = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    console.log("Remaining days calculation:", { today, paymentDate, diff });

    if (diff < 0) return "Expired";
    if (diff === 0) return "Today";
    if (diff === 1) return "1 day left";
    return `${diff} days left`;
  };

  const fetchData = async () => {
    if (!session?.user?.email) {
      console.warn("No session email available");
      if (mountedRef.current) setLoading(false);
      return;
    }

    if (mountedRef.current) setLoading(true);
    console.log("Session email:", session.user.email);
    console.log("Session user:", session.user);

    try {
      // Fetch member data by email
      const { data: memberDataArray, error: memberError } = await supabase
        .from("members")
        .select("*")
        .eq("email", session.user.email);

      console.log("Member query result:", { memberDataArray, memberError });

      if (memberError) {
        console.error("Member fetch error:", memberError);
        if (mountedRef.current) setLoading(false);
        return;
      }

      // Get the first member or null
      let memberData = memberDataArray && memberDataArray.length > 0 ? memberDataArray[0] : null;

      if (!memberData) {
        console.warn("No member profile found for email:", session.user.email);
        // Try to create a basic member profile if user exists but member doesn't
        console.log("Attempting to create member profile...");

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name")
          .eq("email", session.user.email)
          .single();

        if (!userError && userData) {
          const { data: newMember, error: createError } = await supabase
            .from("members")
            .insert({
              name: userData.name,
              email: session.user.email,
              plan: "Basic",
              status: "Active"
            })
            .select()
            .single();

          if (!createError && newMember) {
            console.log("Created member profile:", newMember);
            memberData = newMember;
          } else {
            console.error("Failed to create member profile:", createError);
          }
        }

        if (!memberData) {
          if (mountedRef.current) {
            setMember(null);
            setLoading(false);
          }
          return;
        }
      }

      console.log("Member data:", memberData);
      console.log("Member data keys:", Object.keys(memberData));
      console.log("Member created_at value:", memberData?.created_at);
      console.log("Member plan value:", memberData?.plan);
      console.log("Member status:", memberData?.status);
      const memberId = memberData.id;

      // Fetch sessions using the actual member ID (optional)
      let sessionsData: any[] = [];
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("member_id", memberId)
          .order("date", { ascending: false });

        if (!error) {
          sessionsData = data || [];
        } else {
          console.warn("Sessions fetch error (table may not exist):", error);
        }
      } catch (err) {
        console.warn("Sessions table may not exist:", err);
      }

      console.log("Sessions data:", sessionsData);

      // Fetch progress/weight tracking data (optional)
      let progressRawData: any[] = [];
      try {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("member_id", memberId)
          .order("date", { ascending: true })
          .limit(7);

        if (!error) {
          progressRawData = data || [];
        } else {
          console.warn("Progress fetch error (table may not exist):", error);
        }
      } catch (err) {
        console.warn("Progress table may not exist:", err);
      }

      console.log("Progress data:", progressRawData);

      // Format progress data for chart
      const formattedProgress = progressRawData?.map((p: any) => ({
        day: new Date(p.date).toLocaleDateString("en-US", { weekday: "short" }),
        weight: p.weight || 0,
        date: p.date,
      })) || [];

      if (mountedRef.current) {
        // Add next payment date to member data
        console.log("\n=== BEFORE CALCULATION ===");
        console.log("memberData:", memberData);
        const nextPaymentDate = calculateNextPaymentDate(memberData);
        console.log("\n=== AFTER CALCULATION ===");
        console.log("nextPaymentDate:", nextPaymentDate);
        console.log("nextPaymentDate is null/undefined:", nextPaymentDate === null || nextPaymentDate === undefined);
        
        const formattedDate = nextPaymentDate ? nextPaymentDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";
        console.log("formattedDate:", formattedDate);
        const remainingDaysText = getRemainingDays(nextPaymentDate);
        console.log("remainingDaysText:", remainingDaysText);
        
        const memberDataWithPayment = {
          ...memberData,
          next_payment_date: formattedDate,
          remaining_days: remainingDaysText,
        };

        console.log("Final member data:", memberDataWithPayment);
        setMember(memberDataWithPayment);
        setSessions(sessionsData || []);
        setProgressData(formattedProgress);

        setStats({
          totalSessions: sessionsData?.length || 0,
          streak: calculateStreak(sessionsData || []),
        });
      }

    } catch (err) {
      console.error("Unexpected error in fetchData:", err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // Calculate workout streak
  const calculateStreak = (sessionsData: any[]) => {
    if (!sessionsData || sessionsData.length === 0) return 0;
    
    // Create a copy to avoid modifying original
    const sortedSessions = [...sessionsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].date);
      sessionDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (sessionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    try {
      // First verify current password
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("password")
        .eq("email", session?.user?.email)
        .single();

      if (fetchError || !userData) {
        setPasswordError("Unable to verify current password");
        return;
      }

      const isCurrentPasswordValid = await bcrypt.compare(passwordData.currentPassword, userData.password);
      if (!isCurrentPasswordValid) {
        setPasswordError("Current password is incorrect");
        return;
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, 10);

      // Update password
      const { error: updateError } = await supabase
        .from("users")
        .update({ password: hashedNewPassword })
        .eq("email", session?.user?.email);

      if (updateError) {
        setPasswordError("Failed to update password");
        return;
      }

      // Success
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
      alert("Password updated successfully!");
    } catch (err) {
      setPasswordError("An unexpected error occurred");
      console.error("Password change error:", err);
    }
  };

  if (loading) return (
    <div className="p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-400 mt-2">Fetching member data and progress</p>
        </div>
      </div>
    </div>
  );

  if (!member) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">No member data found</p>
          <p className="text-red-600 text-sm mt-2">Email: {session?.user?.email}</p>
          <p className="text-red-600 text-sm">Make sure you've completed your sign up and your member profile is created.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {member?.name}</h1>
        <p className="text-gray-500">Track your fitness journey</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Membership" value={member?.status} icon={<User />} color="bg-blue-500" />
        <Card title="Next Payment" value={member?.next_payment_date || "N/A"} subtitle={member?.remaining_days} icon={<Calendar />} color="bg-green-500" />
        <Card title="Workout Streak" value={`${stats.streak} days`} icon={<Flame />} color="bg-purple-500" />
        <Card title="Total Sessions" value={stats.totalSessions} icon={<Activity />} color="bg-indigo-500" />
      </div>

      {/* MAIN */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* CHART */}
        <div className="bg-white p-6 rounded-2xl shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Weight Progress (Last 7 Days)</h3>

          {progressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} kg`} />
                <Line type="monotone" dataKey="weight" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              <p>No progress data yet. Start tracking your weight!</p>
            </div>
          )}
        </div>

        {/* TODAY */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Member Info</h3>
          <div className="space-y-3 text-sm">
            <p className="text-gray-600"><strong>Join Date:</strong> {member?.created_at ? new Date(member.created_at).toLocaleDateString() : "N/A"}</p>
            <p className="text-gray-600"><strong>Age:</strong> {member?.age || "N/A"}</p>
            <p className="text-gray-600"><strong>Goal:</strong> {member?.fitness_goal || "N/A"}</p>
            <p className="text-gray-600"><strong>Phone:</strong> {member?.phone || "N/A"}</p>
          </div>

          <div className="mt-4 space-y-2">
            <button 
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Change Password</h4>
              
              {passwordError && (
                <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* RECENT */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>

        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((s) => (
              <div key={s.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium">{s.type || s.exercise_type || "Workout"}</p>
                  <p className="text-sm text-gray-500">{s.trainer_name || "Self-Guided"}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-700">{s.duration || "N/A"} min</p>
                  <p className="text-sm text-gray-500">{new Date(s.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No sessions yet. Book your first session!</p>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, subtitle, icon, color }: any) {
  return (
    <div className={`p-5 rounded-2xl text-white shadow ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">{title}</p>
          <h2 className="text-xl font-bold mt-1">{value}</h2>
          {subtitle && <p className="text-xs mt-1 opacity-90">{subtitle}</p>}
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}