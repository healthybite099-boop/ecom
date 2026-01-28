"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../ProductCard/ProductCard";
const products = [
    {
        id: 1,
        name: "Red Apples",
        brand: "Kashmir",
        size: "500g",
        price: 200,
        finalprice: 180,
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
        <section className=" mx-auto px-3 md:py-36 py-6 bg-[#fdf9f1]">
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
          lg:grid-cols-4
        "
            >
                {products.map((item) => (
                 <ProductCard name={item.name} price={item.price} brand={item.brand} finalprice={item.finalprice} image={item.image} slug={item.slug}/>
                ))}
            </div>
        </section>
    );
}
