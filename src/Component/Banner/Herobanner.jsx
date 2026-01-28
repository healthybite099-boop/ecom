"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    title: "Nature's Gold",
    highlight: "The Premium Selection",
    desc: "Hand-picked, sun-dried, and delivered with integrity.",
    btn: "Discover",
    serial: "01",
  },
  {
    title: "Artisanal Care",
    highlight: "Packed for Longevity",
    desc: "Vacuum-sealed freshness meets eco-friendly craftsmanship.",
    btn: "Shop Now",
    serial: "02",
  },
];

export default function Herobanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    // Height: 45vh on mobile, 85vh on desktop
    <section className="relative overflow-hidden bg-[#f7f3e8] h-[45vh] md:h-[85vh] flex items-center justify-center">
      
      {/* 1. TEXTURE OVERLAY */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-40 bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]"></div>

      {/* 2. BACKGROUND WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className={`text-[30vw] font-black text-[#653825] opacity-[0.02] uppercase transition-transform duration-[3000ms] ease-out ${active === 0 ? 'translate-x-4' : '-translate-x-4'}`}>
          Wownutt
        </h2>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="container mx-auto px-4 relative z-10">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
              active === i 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="max-w-4xl text-center px-4">
              {/* Serial Indicator - Hidden on very small screens to save space */}
              <div className="mb-4 hidden sm:flex justify-center items-center gap-3">
                <span className={`h-[1px] bg-[#653825]/30 transition-all duration-1000 ${active === i ? 'w-10' : 'w-0'}`}></span>
                <span className="text-[#653825] font-mono text-[10px] tracking-[0.3em]">
                  {slide.serial} / 0{slides.length}
                </span>
                <span className={`h-[1px] bg-[#653825]/30 transition-all duration-1000 ${active === i ? 'w-10' : 'w-0'}`}></span>
              </div>

              {/* Headline - Dynamically sized for mobile */}
              <h1 className="text-4xl md:text-8xl font-serif text-[#653825] leading-[1] mb-4">
                <span className={`block transition-all duration-700 delay-100 ${active === i ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  {slide.title}
                </span>
                <span className={`block italic font-light text-2xl md:text-6xl mt-1 text-[#653825]/70 transition-all duration-700 delay-200 ${active === i ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  {slide.highlight}
                </span>
              </h1>

              {/* Description - Shorter and tighter on mobile */}
              <p className={`text-xs md:text-lg text-[#653825]/80 max-w-md mx-auto font-light leading-relaxed transition-all duration-700 delay-300 ${active === i ? 'opacity-100' : 'opacity-0'}`}>
                {slide.desc}
              </p>

              {/* CTA Button - Adjusted padding for mobile */}
              <div className={`mt-6 md:mt-10 transition-all duration-700 delay-400 ${active === i ? 'opacity-100' : 'opacity-0'}`}>
                <Link
                  href="/AllProducts"
                  className="group relative inline-flex items-center gap-4 px-8 py-3 md:px-12 md:py-5 bg-[#653825] text-[#f7f3e8] overflow-hidden rounded-full transition-all duration-300 shadow-lg shadow-[#653825]/10"
                >
                  <span className="relative z-10 font-bold tracking-[0.2em] text-[9px] md:text-[10px] uppercase">{slide.btn}</span>
                  <div className="absolute inset-0 bg-[#4a291b] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 text-xs">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. MINIMAL NAV - Smaller dots for mobile */}
      <div className="absolute bottom-6 md:bottom-10 flex gap-2 z-50">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1 rounded-full transition-all duration-500 ${active === i ? 'w-8 md:w-12 bg-[#653825]' : 'w-2 md:w-4 bg-[#653825]/20'}`}
          />
        ))}
      </div>

    </section>
  );
}