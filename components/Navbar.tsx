import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-lg">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/images/logom.png"
          alt="Work Manager Logo"
          width={248}
          height={50}
          className="h-18 w-auto object-contain"
        />
      </div>

      {/* Menu */}
      <div className="flex items-center gap-6">
        <a href="/" className="hover:text-gray-300 transition">Home</a>
        <a href="/about" className="hover:text-gray-300 transition">About</a>

        {/* Auth Buttons */}
        <a
          href="/signup"
          className="px-4 py-2 rounded-lg hover:bg-gray-600 transition font-bold"
        >
          Sign Up
        </a>

        <a
          href="/login"
          className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition font-bold"
        >
          Sign In
        </a>
      </div>

    </nav>
  );
}
