"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      alert("Invalid credentials");
      return;
    }

    // Get session to check role
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (session?.user?.role === "admin") {
      router.push("/admin-dashboard");
    } else if (session?.user?.role === "manager") {
      router.push("/manager-dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101828] p-6">

      <div className="w-[1000px] h-[600px] bg-white rounded-2xl shadow-2xl grid grid-cols-2 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center px-16">

          <h1 className="text-2xl font-bold text-cyan-600 mb-10">
            World Gym!
          </h1>

          {/* Tabs */}
          <div className="flex gap-6 mb-6">
            <button className="font-semibold text-gray-700 border-b-2 border-cyan-500 pb-1">
              Sign In
            </button>
            <button onClick={() => router.push('/signup')} className="text-gray-400">
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />

            <button
  type="submit"
  disabled={!email || !password || loading}
  className="w-full bg-cyan-600 disabled:bg-gray-300 text-white py-2 rounded-md"
>
  {loading ? "Signing in..." : "SIGN IN"}
</button>

          </form>
  

          <p className="text-xs text-gray-500 mt-4">
            Forgot your password?{" "}
            <span className="text-cyan-600 cursor-pointer">
              Click here
            </span>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t"></div>
            <span className="px-2 text-xs text-gray-400">
              or sign in with
            </span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Social */}
          <div className="space-y-3">

            <button className="w-full border rounded-md py-2 flex items-center justify-center gap-2">
              🌐 Google
            </button>

            <button className="w-full border rounded-md py-2 flex items-center justify-center gap-2">
              📘 Facebook
            </button>

          </div>

          <p className="text-xs text-gray-400 mt-10">
            © 2021 World Gym. All Rights Reserved
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center relative p-10">

          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-8 text-white max-w-sm">

            <h2 className="text-2xl font-semibold mb-6">
              Start your journey with one click and explore the beautiful world!
            </h2>

            <img
              src="/travel-girl.png"
              alt="Traveler"
              className="w-full mt-4"
            />

            {/* dots */}
            <div className="flex gap-2 mt-4">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white/50 rounded-full"></div>
              <div className="w-3 h-3 bg-white/50 rounded-full"></div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}