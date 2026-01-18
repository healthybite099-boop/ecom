"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Gift() {
  const items = [
    {
      title: "Signature Gift Box",
      subtitle: "Premium Selection",
      price: "₹ 2,499",
      img: "/img/222.png",
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
    },
    {
      title: "Royal Box",
      subtitle: "Exclusive Range",
      price: "₹ 4,499",
      img: "/img/222.png",
    },
  ];

  return (
    <div className="bg-[#fdf9f1] py-12 md:py-36">
      <p className="md:text-5xl text-xl text-center text-[#653825] font-bold">
        Explore Our Collections
      </p>
      <p className="text-center text-xs md:text-sm text-[#653825] mt-2 md:mt-4 font-semibold">
        Curated premium categories
      </p>

      <div className="w-[85%] mx-auto mt-12">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-xl px-5 py-12 ">
                <div className="relative mx-auto aspect-square h-44">
                  <Image
                    src={item.img}
                    fill
                    alt={item.title}
                    className="object-contain"
                  />
                </div>

                <div className="flex mt-5 flex-col justify-center items-center">
                  <p className="text-[#653825] font-bold text-xl text-center">
                    {item.title}
                  </p>
                  <p className="text-[#653825] text-sm text-center">
                    {item.subtitle}
                  </p>
                  <p className="text-[#653825] font-semibold mt-1">
                    {item.price}
                  </p>
                  <button className="text-[#653825] border border-[#653825] px-3 py-1 mt-3 hover:bg-[#653825] hover:text-white transition">
                    View Details
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
