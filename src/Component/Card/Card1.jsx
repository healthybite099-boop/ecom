"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
    {
        id: 1,
        name: "Red Apples",
        brand: "Kashmir",
        size: "500g",
        price: 180,
        image: "/img/1.png",
        slug: "red-apples",
    },
    {
        id: 2,
        name: "Bananas",
        brand: "Organic",
        size: "500g",
        price: 90,
        image: "/img/1.png",
        slug: "bananas",
    },
    {
        id: 3,
        name: "Oranges",
        brand: "Nagpur",
        size: "500g",
        price: 140,
        image: "/img/1.png",
        slug: "oranges",
    },
    {
        id: 4,
        name: "Grapes",
        brand: "Fresh Farm",
        size: "500g",
        price: 120,
        image: "/img/1.png",
        slug: "grapes",
    },
    {
        id: 5,
        name: "Mango",
        brand: "Alphonso",
        size: "500g",
        price: 260,
        image: "/img/1.png",
        slug: "mango",
    },
    {
        id: 6,
        name: "Pineapple",
        brand: "Tropical",
        size: "500g",
        price: 110,
        image: "/img/1.png",
        slug: "pineapple",
    },
];

export default function ProductSection() {
    return (
        <section className=" mx-auto px-3 md:py-36 py-12 bg-[#fdf9f1]">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl md:text-3xl font-bold text-[#3b2224]">
                    Our Premium Dry Fruits
                </h2>

                <Link href="/AllProducts"
                    className="
      text-sm md:text-base font-semibold
      text-[#4b1b23]
      hover:underline
      transition
    "
                >
                    View All →
                </Link>
            </div>


            {/* Grid */}
            <div
                className="
          grid gap-4
          grid-cols-2
          md:grid-cols-2
          lg:grid-cols-3
        "
            >
                {products.map((item) => (
                    <Link key={item.id} href={`/Fruits/${item.slug}`}>
                        <article
                            className="
                bg-white backdrop-blur-md
                rounded-2xl  shadow border-[#d9c7b8]
                overflow-hidden
                
                transition-all duration-300
                hover:shadow-md hover:-translate-y-1.5
              "
                        >
                            {/* Brand */}
                            <div className="px-2 pt-2">
                                <span className="text-[10px] font-semibold text-white bg-[#4b1b23] px-2 py-0.5 rounded-full">
                                    {item.brand}
                                </span>
                            </div>

                            {/* Image */}
                            <div className="relative  w-full h-24 md:h-64 aspect-square mt-2 ">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-2">
                                <h3 className="text-sm md:text-xl font-semibold text-[#3b2224] line-clamp-1 text-center">
                                    {item.name}
                                </h3>

                                <div className="flex flex-col md:gap-4 gap-1 items-center justify-between md:mt-2">
                                    <span className="text-sm font-bold text-[#3b2224]">
                                        ₹{item.price} / {item.size}
                                    </span>

                                    <button
                                        className="
                       px-3 py-1 md:px-4 md:py-2
                      rounded-full
                      bg-[#653825]
                      text-white
                      font-semibold
                      md:text-sm text-xs
                    "
                                    >
                                        Add to Cart
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
