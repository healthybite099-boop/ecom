"use client";
import React, { useState } from "react";
import Image from 'next/image'
export default function HomeBanner() {
    return (
        <>
            <div className=" bg-[#f7f3e8] py-12 md:py-36">
                <p className="md:text-5xl text-xl  text-center text-[#653825] font-bold">Explore Our Collections</p>
                <p className=" text-center text-xs md:text-sm text-[#653825] mt-2 md:mt-4 font-semibold">Curated premium categories</p>




                <div className=" w-[80%] mx-auto mt-5 md:mt-12 grid lg:grid-cols-4 grid-cols-2 lg:gap-8">

                    <div className=" bg-white md:border border-t border-l border-[#6538256f] p-2">
                        <div className=" relative  mx-auto aspect-square h-32">
                            <Image src="/img/222.png" fill alt="test"
                                className="object-contain"

                            />
                        </div>
                        <p className=" text-center text-[#653825] font-bold text-sm md:text-xl">Gift Boxes</p>
                    </div>
                    <div className=" bg-white md:border border-t border-l border-r border-[#6538256f] p-2">
                        <div className=" relative  mx-auto aspect-square h-32">
                            <Image src="/img/222.png" fill alt="test"
                                className="object-contain"

                            />
                        </div>
                        <p className=" text-center text-[#653825] font-bold text-sm md:text-xl">Dry Fruits</p>
                    </div>
                    <div className=" bg-white md:border border-b border-l border-t border-[#6538256f] p-2">
                        <div className=" relative  mx-auto aspect-square h-32">
                            <Image src="/img/222.png" fill alt="test"
                                className="object-contain"

                            />
                        </div>
                        <p className=" text-center text-[#653825] font-bold text-sm md:text-xl">Chocolates</p>
                    </div>
                    <div className=" bg-white border border-[#6538256f] p-2">
                        <div className=" relative  mx-auto aspect-square h-32">
                            <Image src="/img/222.png" fill alt="test"
                                className="object-contain"

                            />
                        </div>
                        <p className=" text-center text-[#653825] font-bold text-sm md:text-xl">Corporate Gifts </p>
                    </div>

                </div>
            </div>
        </>
    )
}
