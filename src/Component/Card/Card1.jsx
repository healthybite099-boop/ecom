"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await fetch("/api/products/showhome");
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto px-3 md:py-36 py-6 bg-[#fdf9f1]">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[300px] bg-white rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  // Split products into rows of 4
  const firstRow = products.slice(0, 4);
  const secondRow = products.slice(4, 8);
  const thirdRow = products.slice(8, 12);

  return (
    <section className="mx-auto px-3  py-6 bg-[#fdf9f1]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl md:text-3xl font-bold text-[#3b2224]">Our Premium Dry Fruits</h2>
        <Link href="/AllProducts" className="text-sm font-semibold text-[#4b1b23] hover:underline transition">
          View All →
        </Link>
      </div>

      {/* --- ROW 1 --- */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {firstRow.map((item) => (
          <ProductCard key={item._id} {...item} image={item.images?.[0] || "/img/placeholder.png"} />
        ))}
      </div>

      {/* --- MARKETING BREAK 1 (After 4th Product) --- */}
      <div className="my-16 py-14 border-y border-[#3b2224]/10 text-center">
        <span className="text-xs font-bold tracking-[0.3em] text-[#8c6d45] uppercase">
          Nature's Finest Selection
        </span>
        <h3 className="mt-4 text-2xl md:text-5xl font-serif italic text-[#3b2224] leading-tight px-4">
          "From the heart of the orchards, <br className="hidden md:block" /> 
          delivered fresh to your doorstep."
        </h3>
        <p className="mt-4 text-[#6e5a5b] text-sm md:text-lg max-w-2xl mx-auto italic opacity-80">
          Experience the crunch of purity and the taste of tradition.
        </p>
      </div>

      {/* --- ROW 2 --- */}
      {secondRow.length > 0 && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {secondRow.map((item) => (
            <ProductCard key={item._id} {...item} image={item.images?.[0] || "/img/placeholder.png"} />
          ))}
        </div>
      )}

      {/* --- MARKETING BREAK 2 (After 8th Product) --- */}
      {secondRow.length >= 4 && (
        <div className="my-16 py-14 border-y border-[#3b2224]/10 text-center">
          <span className="text-xs font-bold tracking-[0.3em] text-[#8c6d45] uppercase">
            Quality You Can Trust
          </span>
          <h3 className="mt-4 text-2xl md:text-5xl font-serif italic text-[#3b2224] leading-tight px-4">
            "Sourced with care, <br className="hidden md:block" /> 
            packed for your wellbeing."
          </h3>
          <p className="mt-4 text-[#6e5a5b] text-sm md:text-lg max-w-2xl mx-auto italic opacity-80">
            100% Organic ingredients selected for the health-conscious soul.
          </p>
        </div>
      )}

      {/* --- ROW 3 --- */}
      {thirdRow.length > 0 && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {thirdRow.map((item) => (
            <ProductCard key={item._id} {...item} image={item.images?.[0] || "/img/placeholder.png"} />
          ))}
        </div>
      )}
    </section>
  );
}