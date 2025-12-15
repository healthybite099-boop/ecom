"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// slick styles (VERY IMPORTANT)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 🔑 IMPORTANT: disable SSR for react-slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const slides = [
  {
    id: 1,
    title: "Fresh Fruits Delivered",
    subtitle: "100% Organic & Farm Fresh",
    image:
      "https://d2bpblxcbrb9ld.cloudfront.net/products/114ad521-3305-47fe-9589-1fbb91e9f549-9e375bf3-a073-4d6a-92b8-6f7fe7642622-top-view-mix-nuts-dried-fruits-almonds-raisins-pumpkin-seeds-with-dried-apricots-table.webp",
  },
  {
    id: 2,
    title: "Healthy & Natural",
    subtitle: "Best Quality at Best Price",
    image:
      "https://d2bpblxcbrb9ld.cloudfront.net/products/114ad521-3305-47fe-9589-1fbb91e9f549-9e375bf3-a073-4d6a-92b8-6f7fe7642622-top-view-mix-nuts-dried-fruits-almonds-raisins-pumpkin-seeds-with-dried-apricots-table.webp",
  },
  {
    id: 3,
    title: "Daily Fresh Stock",
    subtitle: "Direct From Farmers",
    image:
      "https://d2bpblxcbrb9ld.cloudfront.net/products/114ad521-3305-47fe-9589-1fbb91e9f549-9e375bf3-a073-4d6a-92b8-6f7fe7642622-top-view-mix-nuts-dried-fruits-almonds-raisins-pumpkin-seeds-with-dried-apricots-table.webp",
  },
];

export default function Herobanner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <div className="relative w-full overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[45vh] md:h-[90vh]">
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              unoptimized
              className="object-cover"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

            {/* Glass Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 md:p-10 shadow-2xl">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                    {slide.title}
                  </h1>

                  <p className="mt-3 text-sm md:text-lg text-white/80">
                    {slide.subtitle}
                  </p>

                  <div className="mt-5 h-1 w-14 rounded-full bg-green-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Slick Dots Styling */}
      <style jsx global>{`
        .slick-dots {
          bottom: 20px;
        }
        .slick-dots li button:before {
          font-size: 9px;
          color: white;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          color: #22c55e;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
