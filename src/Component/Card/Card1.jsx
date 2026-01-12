"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
    {
        id: 1,
        name: "Fresh Red Apples",
        brand: "Kashmir Farms",
        price: 180,
        category: "Fruits",
        weight: "1 Kg",
        rating: 4.5,
        image: "/images/4.jpeg",
        slug: "fresh-red-apples",
    },
    {
        id: 2,
        name: "Organic Bananas",
        brand: "Green Valley",
        price: 90,
        category: "Fruits",
        weight: "1 Dozen",
        rating: 4.3,
        image: "/images/4.jpeg",

        slug: "organic-bananas",
    },
    {
        id: 3,
        name: "Juicy Oranges",
        brand: "Nagpur Fresh",
        price: 140,
        category: "Fruits",
        weight: "1 Kg",
        rating: 4.6,
        image: "/images/4.jpeg",

        slug: "juicy-oranges",
    },
];

export default function ProductSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            {/* Section Header */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#3b2224]">
                    Fresh Fruits Collection
                </h2>
                <p className="text-sm text-[#6b4b4d] mt-2">
                    Hand-picked, farm fresh & quality assured
                </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((item) => (
                    <Link key={item.id} href={`/Fruits/${item.slug}`} className="block">
                        <article
                            className="
                relative bg-white/60 backdrop-blur-lg
                rounded-xl border border-[#d9c7b8]
                overflow-hidden
                shadow-[0_4px_18px_rgba(0,0,0,0.12)]
                transition-all duration-300
                hover:shadow-[0_8px_28px_rgba(0,0,0,0.2)]
                hover:-translate-y-1
              "
                        >
                            {/* Brand Badge */}
                            <span
                                className="
                  absolute top-3 left-3 z-10
                  px-3 py-1 rounded-full
                  bg-[#4b1b23] text-white
                  text-xs font-semibold shadow-md
                "
                            >
                                {item.brand}
                            </span>

                            {/* Image */}
                            <div className="relative w-full aspect-[4/3] bg-[#f5efe6] overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-base font-semibold text-[#3b2224] line-clamp-1">
                                    {item.name}
                                </h3>

                                <p className="text-xs text-[#6b4b4d] mt-1">
                                    {item.category} • {item.weight}
                                </p>

                                {/* Rating */}
                                <div className="flex items-center gap-1 text-sm mt-2">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-medium text-[#3b2224]">
                                        {item.rating}
                                    </span>
                                    <span className="text-xs text-[#6b4b4d]">(Reviews)</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-sm text-[#6b4b4d] line-through">
                                        ₹{item.price + 40}
                                    </span>
                                    <span className="text-lg font-bold text-[#3b2224]">
                                        ₹{item.price}
                                    </span>
                                </div>

                                {/* Action Button */}
                                <button
                                    className="
                    mt-4 w-full py-2
                    rounded-full font-semibold
                    border border-[#4b1b23]
                    text-[#4b1b23]
                    transition-all duration-200
                    hover:bg-[#4b1b23] hover:text-white
                    active:scale-95
                  "
                                >
                                    View Details
                                </button>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
}
