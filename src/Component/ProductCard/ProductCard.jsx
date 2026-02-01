"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductCard({
  _id,
  name,
  price,
  brand,
  finalPrice,
  image,
  slug,
}) {
  const brandBrown = "#653825";
  const brandCream = "#f7f3e8";

  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /* ===============================
     ADD TO CART (LOGIN REQUIRED)
  ================================ */
  const handleAddToCart = async (e) => {
    e.preventDefault(); // stop Link navigation

    // 🚫 NOT LOGGED IN
    if (status !== "authenticated") {
      router.push("/login"); // 🔥 apna login route
      return;
    }

    const userId = session?.user?.id || session?.user?._id;
    if (!_id || !userId) return;

    try {
      setLoading(true);
      await axios.post("/api/cart", {
        userId,
        productId: _id,
        quantity: 1,
      });

      // optional redirect
      // router.push("/Cart");

    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setLoading(false);
    }
  };

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
        {/* BRAND */}
        <div className="absolute top-3 md:top-5 left-3 md:left-5 z-20 hidden md:block">
          <div className="bg-white/90 backdrop-blur-md border border-stone-100 px-3 py-0.5 rounded-full shadow-sm">
            <span
              style={{ color: brandBrown }}
              className="text-[10px] font-extrabold uppercase tracking-tight"
            >
              {brand || "Wownutt"}
            </span>
          </div>
        </div>

        {/* IMAGE */}
        <div className="relative w-full aspect-square rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden bg-[#fcfaf7] flex items-center justify-center">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4 md:p-8 transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="text-stone-300 text-[10px] uppercase font-black">
              Wownutt
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="px-1 py-3 md:p-5 text-center flex flex-col flex-grow justify-between">
          <div>
            <h3
              style={{ color: brandBrown }}
              className="text-sm md:text-lg font-black tracking-tight mb-1 line-clamp-1 italic"
            >
              {name}
            </h3>

            <div className="flex flex-col items-center mt-1">
              <div className="flex items-center gap-2">
                {finalPrice < price && (
                  <span className="text-[10px] md:text-xs text-stone-400 line-through">
                    ₹{price}
                  </span>
                )}
                <span
                  style={{ color: brandBrown }}
                  className="text-base md:text-xl font-black"
                >
                  ₹{finalPrice}
                </span>
              </div>

              <p className="text-[8px] md:text-[10px] uppercase font-bold text-stone-400 tracking-widest mt-0.5">
                Lab Tested Purity
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 mt-3">
            {/* CHECK */}
            <div
              style={{ backgroundColor: brandBrown, color: brandCream }}
              className="
                flex-1 py-2.5 md:py-3 rounded-xl md:rounded-2xl
                font-black text-[10px] md:text-xs
                uppercase tracking-widest
                flex items-center justify-center
                hover:opacity-90
              "
            >
              Check
            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="
                flex-1 py-2.5 md:py-3 rounded-xl md:rounded-2xl
                font-black text-[10px] md:text-xs
                uppercase tracking-widest
                border-2 border-[#653825]
                text-[#653825]
                hover:bg-[#653825] hover:text-white
                transition-all
                disabled:opacity-50
                active:scale-95
              "
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
