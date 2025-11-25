export default function Navbar() {
  return (
    <nav className="w-full bg-gray-600 p-4 text-white flex justify-between">
      <h1 className="font-bold text-xl">Work Manager</h1>
      <div>
        <a href="/" className="px-3 hover:underline">Home</a>
        <a href="/about" className="px-3 hover:underline">About</a>
      </div>
    </nav>
  );
}
