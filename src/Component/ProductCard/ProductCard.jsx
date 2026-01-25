"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ name, price, brand, finalprice, image, slug }) {
  const brandBrown = '#653825';
  const brandCream = '#f7f3e8';

  return (
    <Link href={`/Fruits/${slug}`} className="block group w-full">
      <article
        className="
          relative flex flex-col w-full h-full
          bg-white rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3
          border border-stone-100 shadow-sm
          transition-all duration-500 ease-out
          hover:shadow-xl hover:-translate-y-2
        "
      >
        {/* TOP BADGES - Shrinks on Mobile */}
        <div className="absolute top-3 md:top-5 left-3 md:left-5 right-3 md:right-5 z-20 flex justify-between items-center gap-1">
          <div className="bg-white/90 hidden md:block backdrop-blur-md border border-stone-100 px-2 md:px-3 py-0.5 rounded-full shadow-sm">
            <span style={{ color: brandBrown }} className="text-[8px] md:text-[10px] font-extrabold uppercase tracking-tight">
              {brand || "Wownutt"}
            </span>
          </div>

        </div>

        {/* IMAGE CONTAINER - Stays square regardless of screen width */}
        <div
          className="
            relative w-full aspect-square 
            rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden 
            bg-[#fcfaf7] flex items-center justify-center
          "
        >
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="
                object-contain p-4 md:p-8
                transition-transform duration-700
                group-hover:scale-110
              "
            />
          ) : (
            <div className="text-stone-300 text-[10px] uppercase font-black">Wownutt</div>
          )}
        </div>

        {/* CONTENT - Centers text for balanced look */}
        <div className="px-1 py-3 md:p-5 text-center flex flex-col flex-grow justify-between">
          <div>
            <h3
              style={{ color: brandBrown }}
              className="text-sm md:text-lg font-black tracking-tight mb-1 line-clamp-1 italic leading-tight"
            >
              {name}
            </h3>

            <div className="flex flex-col items-center justify-center mt-1">
              <div className="flex items-center gap-2">
                {finalprice < price && (
                  <span className="text-[10px] md:text-xs text-stone-400 line-through">
                    ₹{price}
                  </span>
                )}

                <span
                  style={{ color: brandBrown }}
                  className="text-base md:text-xl font-black"
                >
                  ₹{finalprice}
                </span>
              </div>

              <p className="text-[8px] md:text-[10px] uppercase font-bold text-stone-400 tracking-widest mt-0.5">
                Lab Tested Purity
              </p>
            </div>
          </div>

          {/* ACTION BUTTON - Larger on Mobile for easy tapping */}
          <div
            style={{
              backgroundColor: brandBrown,
              color: brandCream
            }}
            className="
              md:mt-4 mt-1 w-full py-2.5 md:py-3.5
              rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs
              uppercase tracking-widest
              transition-all duration-300
              flex items-center justify-center gap-2
              hover:opacity-90 active:scale-95
            "
          >
            Check
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}