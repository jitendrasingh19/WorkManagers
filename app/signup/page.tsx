'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (user) {
      await supabase.from("users").insert([
        {
          id: user.id,
          name,
          email,
          role,
        },
      ]);
    }

    setLoading(false);
    alert("Account created!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE (Branding) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">GYM PRO</h1>
        <p className="text-gray-300 text-center max-w-sm">
          Track workouts, manage members, and grow your fitness business with ease.
        </p>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100">
        <form
          onSubmit={handleSignup}
          className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md space-y-5"
        >
          <h2 className="text-2xl font-bold text-center">Create Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ROLE SELECT */}
          <select
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="member">Member</option>
            <option value="manager">Manager</option>
          </select>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-black cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}