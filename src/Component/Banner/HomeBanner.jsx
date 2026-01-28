"use client";
import React from "react";
import Image from 'next/image';
import Link from 'next/link';

const collections = [
  { name: "Gift Boxes", img: "/img/222.png", href: "/gifts" },
  { name: "Dry Fruits", img: "/img/222.png", href: "/dry-fruits" },
  { name: "Chocolates", img: "/img/222.png", href: "/chocolates" },
  { name: "Corporate Gifts", img: "/img/222.png", href: "/corporate" },
];

export default function HomeBanner() {
  return (
    <section className="bg-[#f7f3e8] py-16 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="mb-10 md:mb-16 ml-2 md:ml-0 md:text-center">
          <p className="text-[#653825]/60 text-[10px] tracking-[0.3em] uppercase font-bold mb-2">
            Selection
          </p>
          <h2 className="text-3xl md:text-5xl text-[#653825] font-serif font-medium leading-tight">
            Explore <span className="italic font-light">Collections</span>
          </h2>
          <p className="text-[#653825]/70 text-xs md:text-sm mt-2 md:mt-4 font-medium uppercase tracking-widest">
            Curated premium categories
          </p>
        </div>

        {/* Mobile: Horizontal Snap Scroll (No library needed)
            Desktop: 4-Column Grid 
        */}
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-8 overflow-x-auto pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory">
          {collections.map((item, index) => (
            <Link 
              href={item.href} 
              key={index}
              className="group min-w-[70vw] sm:min-w-[40vw] md:min-w-0 snap-center relative bg-white border border-[#653825]/5 p-6 md:p-10 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-[#653825]/10 hover:-translate-y-2"
            >
              {/* Image with Floating Effect */}
              <div className="relative mx-auto aspect-square w-full max-w-[140px] md:max-w-[180px] mb-8">
                {/* Subtle Shadow/Glow behind image */}
                <div className="absolute inset-4 bg-[#653825]/5 rounded-full blur-2xl group-hover:bg-[#653825]/10 transition-colors duration-500"></div>
                
                <Image 
                  src={item.img} 
                  fill 
                  alt={item.name}
                  className="object-contain transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
                />
              </div>

              {/* Title & Interaction */}
              <div className="text-center relative">
                <p className="text-[#653825] font-serif text-xl md:text-2xl tracking-tight">
                  {item.name}
                </p>
                
                {/* Visual Accent */}
                <div className="mt-4 flex justify-center items-center gap-2">
                  <div className="h-[1px] w-0 group-hover:w-8 bg-[#653825]/30 transition-all duration-500"></div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#653825] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    EXPLORE
                  </span>
                  <div className="h-[1px] w-0 group-hover:w-8 bg-[#653825]/30 transition-all duration-500"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile-only scroll indicator */}
        <div className="flex md:hidden justify-center gap-1.5 mt-2">
            <div className="h-1 w-8 bg-[#653825] rounded-full"></div>
            <div className="h-1 w-2 bg-[#653825]/20 rounded-full"></div>
            <div className="h-1 w-2 bg-[#653825]/20 rounded-full"></div>
        </div>
      </div>
      
      {/* Tailwind CSS for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}