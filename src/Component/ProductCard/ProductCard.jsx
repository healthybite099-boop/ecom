import React from "react";
import Image from "next/image";
import Link from "next/link";

function ProductCard({ name, price, brand, image, slug }) {
  const displayPrice = price ? `₹${price}` : "—";
  const fallback = "/placeholder-product.png";

  return (
    <Link href={`/Fruits/${slug}`} className="block">
      <div
        className="
        group relative rounded-xl overflow-hidden
        bg-white border border-gray-100
        shadow-sm hover:shadow-lg hover:-translate-y-1
        transition-all duration-300 cursor-pointer
        w-full max-w-[210px] mx-auto
      "
      >
        {/* Product Image - No Padding */}
        <div className="relative h-40 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
          <Image
            src={image || fallback}
            alt={name}
            fill
            className="
              object-cover            /* <-- fills the frame better */
              transition-transform duration-300 
              group-hover:scale-105
            "
            sizes="200px"
          />
        </div>

        {/* Content */}
        <div className="px-3 py-3 space-y-1">
          <h2 className="text-[14px] font-semibold text-gray-900 line-clamp-1">
            {name}
          </h2>

          <span className="text-[11px] text-gray-500 inline-block bg-gray-100 px-2 py-0.5 rounded-full">
            {brand}
          </span>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[15px] font-bold text-green-700">
              {displayPrice}
            </span>

            <button
              onClick={(e) => e.preventDefault()}
              className="
                text-[11px] px-3 py-1 rounded-md font-medium
                bg-yellow-400 text-yellow-900
                hover:bg-yellow-300 active:scale-95 
                transition
              "
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default React.memo(ProductCard);
