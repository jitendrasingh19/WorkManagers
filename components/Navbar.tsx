"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-3 shadow-lg">
      <div className="flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logom.png"
            alt="Work Manager Logo"
            width={248}
            height={50}
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="hover:text-gray-300 transition">Home</a>
          <a href="/about" className="hover:text-gray-300 transition">About</a>

          <a
            href="/signup"
            className="px-4 py-2 rounded-lg hover:bg-gray-600 transition font-bold"
          >
            Sign Up
          </a>

          <a
            href="/login"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-bold transition"
          >
            Sign In
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <a href="/" className="hover:text-gray-300">Home</a>
          <a href="/about" className="hover:text-gray-300">About</a>

          <a
            href="/signup"
            className="px-4 py-2 rounded-lg hover:bg-gray-600 font-bold"
          >
            Sign Up
          </a>

          <a
            href="/login"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 font-bold"
          >
            Sign In
          </a>
        </div>
      )}
    </nav>
  );
}