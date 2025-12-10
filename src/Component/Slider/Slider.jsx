"use client";
import React from "react";
import Image from "next/image";

export default function Slider() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto mt-6 px-4">

      {/* Big Image */}
      <div className="md:col-span-2">
        <Image
          src="https://picsum.photos/id/1015/800/500"
          alt="Business Website Development - Neo IT Solution"
          width={800}
          height={500}
          className="w-full h-[250px] md:h-[400px] object-cover rounded-2xl"
        />
      </div>

      {/* Right Side Images - Hidden on Mobile */}
      <div className="hidden md:flex md:flex-col gap-4">
        <Image
          src="https://picsum.photos/id/1020/400/200"
          alt="High Performance Web Solutions"
          width={400}
          height={200}
          className="w-full h-[190px] object-cover rounded-2xl"
        />

        <Image
          src="https://picsum.photos/id/1018/400/200"
          alt="Secure and Reliable Software"
          width={400}
          height={200}
          className="w-full h-[190px] object-cover rounded-2xl"
        />
      </div>

    </div>
  );
}
