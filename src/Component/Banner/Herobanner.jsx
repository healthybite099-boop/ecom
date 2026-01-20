"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Premium Dry Fruits",
    highlight: "for Everyday Wellness",
    desc: "Pure • Authentic • Carefully Sourced Nuts",
    btn: "Order Now",
    img: "/img/oo.png",
  },
  {
    title: "Fresh & Hygienic",
    highlight: "Packed with Care",
    desc: "Quality you can trust, taste you’ll love",
    btn: "Shop Now",
    img: "/img/oo.png",
  },
];

export default function Herobanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>

      <section className="relative border-t-2 border-[#653825] overflow-hidden bg-[#f7f3e8] md:h-[90vh] h-40">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${active === i ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <div className="mx-auto max-w-7xl md:px-6 px-2 md:py-20 grid grid-cols-2 items-center gap-10 ralative">

              <Image src={slide.img}
                alt="qqwer"
                fill
              />
            </div>
          </div>
        ))}

        {/* DOTS */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 w-2 rounded-full transition ${active === i ? "bg-[#653825] w-6" : "bg-gray-400"
                }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
