"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
    {
        id: 1,
        name: "Red Apples",
        brand: "Kashmir",
        price: 180,
        image: "/images/1.png",
        slug: "red-apples",
    },
    {
        id: 2,
        name: "Bananas",
        brand: "Organic",
        price: 90,
        image: "/images/1.png",
        slug: "bananas",
    },
    {
        id: 3,
        name: "Oranges",
        brand: "Nagpur",
        price: 140,
        image: "/images/1.png",
        slug: "oranges",
    },
    {
        id: 4,
        name: "Grapes",
        brand: "Fresh Farm",
        price: 120,
        image: "/images/1.png",
        slug: "grapes",
    },
    {
        id: 5,
        name: "Mango",
        brand: "Alphonso",
        price: 260,
        image: "/images/1.png",
        slug: "mango",
    },
    {
        id: 6,
        name: "Pineapple",
        brand: "Tropical",
        price: 110,
        image: "/images/1.png",
        slug: "pineapple",
    },
];

export default function ProductSection() {
    return (
        <section className=" mx-auto px-3 py-6">
            {/* Header */}
           <div className="mb-4 flex items-center justify-between">
  <h2 className="text-2xl md:text-3xl font-bold text-[#3b2224]">
    Fresh Dry Fruits
  </h2>

  <button
    className="
      text-sm md:text-base font-semibold
      text-[#4b1b23]
      hover:underline
      transition
    "
  >
    View All →
  </button>
</div>


            {/* Grid */}
            <div
                className="
          grid gap-4
          grid-cols-2
          md:grid-cols-4
          lg:grid-cols-6
        "
            >
                {products.map((item) => (
                    <Link key={item.id} href={`/Fruits/${item.slug}`}>
                        <article
                            className="
                bg-white/60 backdrop-blur-md
                rounded-lg border border-[#d9c7b8]
                overflow-hidden
                shadow-sm
                transition-all duration-300
                hover:shadow-md hover:-translate-y-0.5
              "
                        >
                            {/* Brand */}
                            <div className="px-2 pt-2">
                                <span className="text-[10px] font-semibold text-white bg-[#4b1b23] px-2 py-0.5 rounded-full">
                                    {item.brand}
                                </span>
                            </div>

                            {/* Image */}
                            <div className="relative w-full aspect-[4/3] mt-2 bg-[#f5efe6]">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-2">
                                <h3 className="text-sm font-semibold text-[#3b2224] line-clamp-1">
                                    {item.name}
                                </h3>

                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-bold text-[#3b2224]">
                                        ₹{item.price}
                                    </span>

                                    <button
                                        className="
                      text-xs px-3 py-1
                      rounded-full
                      border border-[#4b1b23]
                      text-[#4b1b23]
                      hover:bg-[#4b1b23] hover:text-white
                      transition
                    "
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
}
