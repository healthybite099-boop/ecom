"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ name, price, brand, image, slug }) {



  return (
    <Link href={`/Fruits/${slug}`} className="block">
      <article
        className="
        relative bg-white/60 backdrop-blur-lg 
        rounded-xl border border-[#d9c7b8]
        overflow-hidden shadow-[0_4px_18px_rgba(0,0,0,0.12)]
        transition-all duration-300 
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.2)]
        hover:-translate-y-1
      "
      >
        {/* Floating Price Tag */}
        <div
          className="
          absolute top-3 left-3 z-10 
          px-3 py-1 rounded-full 
          bg-[#4b1b23] text-white text-xs font-semibold
          shadow-md
        "
        >
          {brand}
        </div>

        {/* Product Image Section */}
        <div
          className="
          relative w-full aspect-[4/3] sm:aspect-[16/11]
          bg-[#f5efe6]
          overflow-hidden
        
          shadow-inner
        "
        >
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="
              object-cover transition-transform duration-500
              group-hover:scale-105
            "
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-300">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-base font-semibold text-[#3b2224] line-clamp-1">
            {name}
          </h3>
          {brand && (
            <p className="text-xs text-[#6b4b4d] mt-0.5 line-clamp-1">{brand}</p>
          )}

          <div className="flex items-end gap-3 mb-1">
            <div className="text-sm text-[#6b4b4d] line-through">Rs {price}</div>
            <div className="text-sm  font-bold text-[#3b2224]">Rs {price}</div>
          </div>

          {/* Button */}
          <button
            className="
            mt-3 w-full py-1.5 
            rounded-full font-semibold
            border border-[#4b1b23]
            text-[#4b1b23]
            transition-all duration-200
            hover:bg-[#4b1b23] hover:text-white
            active:scale-95
            cursor-pointer
          "
          >
            Check
          </button>
        </div>
      </article>
    </Link>
  );
}
