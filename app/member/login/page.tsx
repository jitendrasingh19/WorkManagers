'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function MemberLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔐 Login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      alert("User not found");
      return;
    }

    // 📊 Get user role from DB
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) {
      alert("Error fetching role");
      return;
    }

    // 🚫 Only allow members
    if (userData.role !== "member") {
      alert("Please use admin/manager login page");
      return;
    }

    // ✅ Redirect to member dashboard
    router.push("/dashboard/member");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Member Login</h1>
          <p className="text-blue-100">Welcome back to World Gym!</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={!email || !password || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Forgot your password?{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                Reset here
              </span>
            </p>

            <p className="text-sm text-gray-500">
              Not a member? Contact your gym administrator.
            </p>
          </div>

          {/* Back */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Admin/Manager Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}