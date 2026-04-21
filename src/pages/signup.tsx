'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    identity: "",
    password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)

    const role =
      formData.identity === "manager"
        ? "manager"
        : formData.identity === "admin"
        ? "admin"
        : "member"

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const err = await res.json()
      alert(err.error || "Could not create user")
      return
    }

    alert("Account created! Now log in.")
    window.location.href = "/login";

  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-gray-800 to-gray-900"></div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-400 flex items-center justify-center bg-yellow-400 bg-opacity-10">
              <span className="text-5xl font-bold text-yellow-400"></span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-gray-400 mb-8">Create your gym account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm uppercase tracking-widest mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full bg-transparent text-white placeholder-gray-500 pb-3 border-b-2 border-gray-600 focus:border-yellow-400 outline-none transition duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              className="w-full bg-transparent text-white placeholder-gray-500 pb-3 border-b-2 border-gray-600 focus:border-yellow-400 outline-none transition duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm uppercase tracking-widest mb-2">Identity</label>
            <select
              name="identity"
              value={formData.identity}
              onChange={handleChange}
              required
              className="w-full bg-transparent text-white pb-3 border-b-2 border-gray-600 focus:border-yellow-400 outline-none transition duration-300"
            >
              <option value="" className="bg-gray-800">Select your identity</option>
              <option value="admin" className="bg-gray-800">Admin</option>
              <option value="manager" className="bg-gray-800">Manager</option>
             ```` {/* <option value="team_member" className="bg-gray-800">Team Member</option>
              <option value="user" className="bg-gray-800">User</option>```` */}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full bg-transparent text-white placeholder-gray-500 pb-3 border-b-2 border-gray-600 focus:border-yellow-400 outline-none transition duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm uppercase tracking-widest mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="w-full bg-transparent text-white placeholder-gray-500 pb-3 border-b-2 border-gray-600 focus:border-yellow-400 outline-none transition duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3 font-bold text-lg uppercase tracking-widest transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-8"
          >
            {loading ? "Creating account..." : "SIGN UP"}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-yellow-400 font-semibold hover:text-yellow-300">
                Log In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
