// pages/about.js
import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
        
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4 text-black">About Page</h1>
        <p className="text-gray-600 mb-4 text-lg">
          This is the about page of my Next.js application!
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>

      {/* Image */}
      <Image
        src="/images/profile.jpg"
        alt="Profile"
        width={920}
        height={500}
        className="rounded-xl shadow-lg object-cover w-full max-w-4xl mt-8 mb-8"
      />

      {/* About text */}
      <div className="max-w-3xl text-gray-700 leading-relaxed text-justify">
        <p className="mb-4">
          The “About Us” page is a must-have page used by all types of
          businesses to give customers more insight into who is involved with a
          given business and exactly what it does.
        </p>
        <p className="mb-4">
          Your “About Me” page forms the first impression of a company or
          product, puts a name and a face to your business, and gives website
          visitors the opportunity to develop a connection with you — a good
          reason for them to stay on your site.
        </p>
        <p>
          The About page is a space for individuality and originality; it is an
          important marketing tool that should convince. Therefore, each one is
          unique!
        </p>
      </div>
      
      {/* Image */}
      <hr className="w-1/2 border-gray-300 my-12" />
      <Image
        src="/images/blog.jpg"
        alt="Profile"
        width={920}
        height={500}
        className="rounded-xl shadow-lg object-cover w-full max-w-4xl mb-16 m-16"
      />
      {/* Services Section */}
{/* Services Section */}
<div className="w-full max-w-6xl mt-20 mb-24">
  <h2 className="text-4xl font-bold text-center text-black mb-12">
    One Service
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

    {/* Card 1 */}
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
      <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-3xl mb-6">
        ⭐
      </div>
      <h3 className="text-2xl font-semibold text-black mb-3">Delivering Seamless Experiences</h3>
      <p className="text-gray-600">
        Make it easy we transform complex workloads into effortless progress.
      </p>
    </div>

    {/* Card 2 */}
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
      <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl text-3xl mb-6">
        ⚙️
      </div>
      <h3 className="text-2xl font-semibold text-black mb-3">Orchestrating Unified Frameworks</h3>
      <p className="text-gray-600">
        Keep it simple we own the process that transcends typical limitations.
      </p>
    </div>

    {/* Card 3 */}
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
      <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl text-3xl mb-6">
        🚀
      </div>
      <h3 className="text-2xl font-semibold text-black mb-3">Compounding Partnership Gains</h3>
      <p className="text-gray-600">
       Do good for people we serve with hearts to impact what matters most.
      </p>
    </div>

  </div>
</div>
   <h2 className="text-4xl font-bold text-center text-black mb-12">
       Discover Who We are and Why.</h2>
      <span
  className="
    text-4xl 
    font-bold
    italic
    bg-gradient-to-r from-blue-500 to-purple-600 
    bg-clip-text text-transparent
  "
>
  We Built That Platform
</span>
      
    </div>
    
  );
}
