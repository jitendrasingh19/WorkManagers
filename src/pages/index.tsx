import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        
        {/* Background Image */}
        <Image
          src="/images/worldgym.png"
          alt="Gym Background"
          fill
          priority
          className="object-cover opacity-100"
        />

          <div className="absolute inset-0 bg-black/30" />

      {/* LEFT ARROW */}
      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20
                   bg-white/20 hover:bg-white/30
                   backdrop-blur-md
                   rounded-full p-3 transition"
      >
        <ChevronLeft className="h-8 w-8 text-white" />
      </button>

      {/* RIGHT ARROW */}
      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20
                   bg-white/20 hover:bg-white/30
                   backdrop-blur-md
                   rounded-full p-3 transition"
      >
        <ChevronRight className="h-8 w-8 text-white" />
      </button>
<div className="arrw-bx hdn pd_h" data-v-4bf62ab4=""><h1 className="title-hero" data-v-4bf62ab4=""><span data-v-4bf62ab4="">BUILDING THE NEXT GENERATION OF LEGENDS</span></h1></div>
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl w-full px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-6 text-center md:text-left max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Feel Great Body & Mind.
            </h1>
            <p className="text-lg text-gray-200">
              Choose from hundreds of workouts, healthy recipes, guided meditations, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                className="rounded-xl bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200 transition"
                href="#"
              >
                Join now
              </a>
             <a
                className="rounded-xl bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200 transition"
                href="#"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
         
      
       
      </section>
     <section className="relative w-full bg-white py-28 overflow-hidden">
  
  {/* LEFT RED BAR + ARROWS */}
  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
    <div className="h-16 w-[280px] bg-red-700" />
    <div className="flex gap-2 ml-4">
      <span className="chevron-right" />
      <span className="chevron-right" />
    </div>
  </div>

  {/* RIGHT RED BAR + ARROWS */}
  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center flex-row-reverse">
    <div className="h-16 w-[280px] bg-red-700" />
    <div className="flex gap-2 mr-4">
      <span className="chevron-left" />
      <span className="chevron-left" />
    </div>
  </div>

  {/* CENTER CONTENT */}
  <div className="relative z-10 text-center">
    <p className="uppercase tracking-wide text-sm font-semibold">
      Find Your
    </p>
    <h2 className="text-4xl font-extrabold tracking-wide mt-2">
      LOCAL WORLD GYM
    </h2>

    <div className="mt-6 flex justify-center gap-4">
      <input
        type="text"
        placeholder="Enter City Or Zip Code*"
        className="border px-4 py-3 w-72"
      />
      <button className="bg-red-700 text-white px-6 py-3 font-bold">
        SUBMIT
      </button>
    </div>
  </div>
</section>

    </div>
  )
}
