"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function Home() {
  const images = [
    "/images/worldgym.png",
    "/images/gym4.jpg",
    "/images/gym2.jpg",
    "/images/gym3.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    
    );
   
  };
  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }, 3000);

  return () => clearInterval(interval);
}, [images.length]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
  {images.map((_, index) => (
    <button
      key={index}
      onClick={() => setCurrentSlide(index)}
      className={`h-3 w-3 rounded-full ${
        currentSlide === index ? "bg-white" : "bg-white/40"
      }`}
    />
  ))}
</div>
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        
        {/* Background Image */}
   <Image
  key={currentSlide}
  src={images[currentSlide]}
  alt="Gym Background"
  fill
  priority
  className="object-cover transition-opacity duration-1000 ease-in-out"
/>

          <div className="absolute inset-0 bg-black/30" />

      {/* LEFT ARROW */}
      <button
  onClick={prevSlide}
  className="absolute left-6 top-1/2 -translate-y-1/2 z-20
             bg-white/20 hover:bg-white/30
             backdrop-blur-md rounded-full p-3 transition"
>
        <ChevronLeft className="h-8 w-8 text-white" />
      </button>


      {/* RIGHT ARROW */}
 <button
  onClick={nextSlide}
  className="absolute right-6 top-1/2 -translate-y-1/2 z-20
             bg-white/20 hover:bg-white/30
             backdrop-blur-md rounded-full p-3 transition"
>
        <ChevronRight className="h-8 w-8 text-white" />
      </button>

        {/* Optional overlay */}
        {/* <div className="absolute inset-0 bg-black/30" /> */}

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
                href="signup"
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

{/* Testimonials Section */}
<section className="bg-gray-100 py-20">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">
      Testimonials
    </p>

    <h2 className="text-4xl md:text-5xl font-extrabold mb-12">
      What Our Members Say
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Card 1 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
        <p className="text-5xl font-bold text-gray-300 mb-4">“</p>
        <p className="text-gray-600 leading-7 mb-6">
          World Gym has transformed my fitness journey. The trainers are amazing and the community is supportive.
        </p>
        <div className="border-t pt-4">
          <p className="font-bold text-lg">Sarah Johnson</p>
          <p className="text-sm text-gray-400">Member</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
        <p className="text-5xl font-bold text-gray-300 mb-4">“</p>
        <p className="text-gray-600 leading-7 mb-6">
          I've never felt better. The variety of classes and equipment keeps me motivated every day.
        </p>
        <div className="border-t pt-4">
          <p className="font-bold text-lg">Mike Chen</p>
          <p className="text-sm text-gray-400">Fitness Enthusiast</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
        <p className="text-5xl font-bold text-gray-300 mb-4">“</p>
        <p className="text-gray-600 leading-7 mb-6">
          Joining World Gym was the best decision I made for my health. Highly recommend!
        </p>
        <div className="border-t pt-4">
          <p className="font-bold text-lg">Emily Davis</p>
          <p className="text-sm text-gray-400">Premium Member</p>
        </div>
      </div>
    </div>
  </div>
</section>
{/* Footer Section */}
<section className="bg-gray-900 text-white py-12">
  <div>
  <h1 className="text-center font-bold text-4xl m-9">
    STAY INFORMED & GET FIT
    
  </h1>
  <p className="text-center mb-7">Get the latest World Gym news, fitness tips, & exclusive offers delivered straight to your inbox.</p>
  
</div>
 
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
       
      <div>
        <h3 className="text-lg font-bold mb-4">World Gym</h3>
        <p className="text-gray-400">
          Building the next generation of legends. Feel great body & mind with our comprehensive fitness programs.
        </p>
      </div>
      <div>
        <h4 className="text-md font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Locations</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Membership</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-md font-semibold mb-4">Programs</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white">Workouts</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Classes</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Personal Training</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Nutrition</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-md font-semibold mb-4">Contact Info</h4>
        <p className="text-gray-400">Email: info@worldgym.com</p>
        <p className="text-gray-400">Phone: (123) 456-7890</p>
        <p className="text-gray-400">Address: Your City, State</p>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
      <p className="text-gray-400">&copy; 2024 World Gym. All rights reserved.</p>
    </div>
  </div>
</section>

    </div>
  )
}
