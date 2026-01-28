"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function Gift() {
  const items = [
    {
      title: "Signature Gift Box",
      subtitle: "Premium Selection",
      price: "₹ 2,499",
      img: "/img/222.png",
      tag: "Best Seller"
    },
    {
      title: "Dry Fruit Hamper",
      subtitle: "Luxury Assortment",
      price: "₹ 1,999",
      img: "/img/222.png",
    },
    {
      title: "Festive Combo",
      subtitle: "Best Seller",
      price: "₹ 3,199",
      img: "/img/222.png",
      tag: "Limited"
    },
    {
      title: "Royal Box",
      subtitle: "Exclusive Range",
      price: "₹ 4,499",
      img: "/img/222.png",
    },
  ];

  return (
    <div className="bg-[#fdf9f1] py-16 md:py-32">
      {/* Header */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-5xl text-[#653825] font-serif italic mb-3">
          Curated Gift Boxes
        </h2>
        <div className="h-[1px] w-16 bg-[#653825]/30 mx-auto mb-4"></div>
        <p className="text-[#653825]/70 text-xs md:text-sm uppercase tracking-[0.2em] font-medium">
          Thoughtfully packed for every occasion
        </p>
      </div>

      <div className="w-[90%] lg:w-[85%] mx-auto">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.custom-pagination' }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1.2, centeredSlides: true }, // Show peek of next slide on mobile
            640: { slidesPerView: 2, centeredSlides: false },
            1024: { slidesPerView: 3, centeredSlides: false },
            1280: { slidesPerView: 4, centeredSlides: false },
          }}
          className="!pb-16"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="group bg-white rounded-2xl p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover:shadow-[#653825]/5 border border-[#653825]/5 relative overflow-hidden">
                
                {/* Optional Badge */}
                {item.tag && (
                    <span className="absolute top-4 right-4 bg-[#653825] text-[#fdf9f1] text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10">
                        {item.tag}
                    </span>
                )}

                {/* Image Section */}
                <div className="relative mx-auto aspect-square h-40 md:h-52 mb-8 transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute inset-0 bg-[#653825]/5 rounded-full blur-3xl scale-0 group-hover:scale-100 transition-transform duration-500 opacity-50"></div>
                  <Image
                    src={item.img}
                    fill
                    alt={item.title}
                    className="object-contain z-10"
                  />
                </div>

                {/* Content Section */}
                <div className="text-center">
                  <span className="text-[10px] text-[#653825]/50 font-bold tracking-[0.2em] uppercase mb-1 block">
                    {item.subtitle}
                  </span>
                  <p className="text-[#653825] font-serif text-xl md:text-2xl mb-2">
                    {item.title}
                  </p>
                  <p className="text-[#653825] font-sans font-bold text-lg mb-6">
                    {item.price}
                  </p>
                  
                  <button className="w-full text-[#653825] border border-[#653825] py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-[#653825] hover:text-white transition-all duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Styled Pagination Container */}
        <div className="custom-pagination flex justify-center gap-2 mt-4"></div>
      </div>

      {/* Global CSS for Swiper dots to match your brown theme */}
      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          background: #653825 !important;
          opacity: 0.2;
          width: 8px;
          height: 8px;
          transition: all 0.3s;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}