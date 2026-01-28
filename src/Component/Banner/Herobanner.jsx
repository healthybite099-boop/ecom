"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    title: "Nature's Gold",
    highlight: "The Premium Selection",
    desc: "Hand-picked, sun-dried, and delivered with integrity. Experience the true essence of purity.",
    btn: "Discover Collection",
    serial: "01"
  },
  {
    title: "Artisanal Care",
    highlight: "Packed for Longevity",
    desc: "Vacuum-sealed freshness meets eco-friendly craftsmanship. Wellness in every crunch.",
    btn: "Shop The Range",
    serial: "02"
  },
];

export default function Herobanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f7f3e8] md:h-[85vh] h-[60vh] flex items-center justify-center">
      
      {/* 1. PREMIUM GRAIN OVERLAY (Gives a paper/organic texture) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]"></div>

      {/* 2. ELEGANT INNER FRAME */}
      <div className="absolute inset-4 md:inset-10 border border-[#653825]/10 pointer-events-none"></div>

      {/* 3. FLOATING BRAND LOGO BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[25vw] font-black text-[#653825] opacity-[0.02] uppercase tracking-tighter italic">
          Wownutt
        </h2>
      </div>

      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23, 1, 0.32, 1)] flex items-center justify-center ${
            active === i ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
          }`}
        >
          <div className="max-w-5xl mx-auto text-center px-6 relative">
            
            {/* Serial Number Indicator */}
            <div className="mb-6 flex justify-center items-center gap-4">
               <span className="h-[1px] w-8 bg-[#653825]/30"></span>
               <span className="text-[#653825] font-mono text-sm tracking-widest">{slide.serial} / 02</span>
               <span className="h-[1px] w-8 bg-[#653825]/30"></span>
            </div>

            {/* Main Title with staggered animation */}
            <h1 className="text-5xl md:text-8xl font-serif text-[#653825] leading-[1.1] tracking-tight">
              {slide.title} <br />
              <span className="italic font-light text-[#653825]/80 serif leading-none">
                {slide.highlight}
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-sm md:text-xl text-[#653825]/70 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
              {slide.desc}
            </p>

            {/* CTA - Minimalist Luxury Style */}
            <div className="mt-12">
              <Link
                href="/AllProducts"
                className="group relative inline-flex items-center gap-3 px-12 py-5 bg-[#653825] text-[#f7f3e8] overflow-hidden transition-all duration-300 rounded-sm"
              >
                <span className="relative z-10 font-bold tracking-widest text-xs uppercase">{slide.btn}</span>
                <div className="absolute inset-0 bg-[#4a291b] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      ))}

     

      {/* 5. CORNER ELEMENTS (The "Boutique" Touch) */}
     
    </section>
  );
}