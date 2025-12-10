"use client";
import React, { useState } from "react";
import Image from 'next/image'
export default function HomeBanner() {
    const [activeTab, setActiveTab] = useState("business");
    return (
        <>
            <div className="border-b border-gray-200 py-6">
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  

                    <div className=" grid gap-4  lg:grid-cols-3 lg:grid-rows-2">

                        <div className="relative lg:row-span-2">
                            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl" />
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                   <p className="text-2xl font-semibold text-[#f76f00] text-center sm:text-left">
                                        Mobile Friendly Designs
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                        90% users browse on mobile. We build responsive websites that look stunning on every screen.
                                    </p>
                                </div>
                                <div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                                    <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                                        <Image
                                            src="/images/WhatsApp Image 2025-12-05 at 15.46.55_c0e0f261.jpg"
                                            alt=''
                                            width="500"
                                            height="800"
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl" />
                        </div>

                        <div className="relative max-lg:row-start-1">
                            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl" />
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                    <p className="text-2xl font-semibold text-[#f76f00] text-center sm:text-left">
                                        High Performance & Speed
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                        Faster websites = More customers. Optimized pages for lightning-fast user experience.
                                    </p>
                                </div>
                                <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                                    <Image
                                        width={400}
                                        height={200}
                                        alt=""
                                        src="/images/10029652.png"
                                        className="w-full max-lg:max-w-xs"
                                    />
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl" />
                        </div>

                        <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                            <div className="absolute inset-px rounded-lg bg-white" />
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                   <p className="text-2xl font-semibold text-[#f76f00] text-center sm:text-left">
                                        Secure & Reliable
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                        We protect your website with advanced security to keep business data safe & trusted.
                                    </p>
                                </div>
                                <div className="  flex flex-1 items-center justify-center lg:pb-2">
                                    <Image
                                        width={350}
                                        height={350}
                                        alt=""
                                        src="/images/2347.jpg"
                                        className="w-48 h-26 rounded-xl"
                                    />
                                </div>

                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                        </div>

                        <div className="relative lg:row-span-2">
                            <div className="absolute inset-0 rounded-lg bg-[#FFF8EA] max-lg:rounded-b-4xl lg:rounded-r-4xl" />


                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                                {/* Title Section */}
                                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                    <p className="text-2xl font-semibold text-[#f76f00] text-center sm:text-left">
                                        Custom Software Solutions
                                    </p>
                                 <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                        Whether eCommerce or automation — We build powerful software that fits your business needs.
                                    </p>
                                </div>

                                {/* Tabs Section */}
                                <div className="relative min-h-120 w-full grow">
                                    <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-white shadow-2xl outline outline-white/10">

                                        {/* Tab Buttons */}
                                      <div className="flex flex-col sm:flex-row border-b border-gray-200">
                                            <button
                                                onClick={() => setActiveTab("business")}
                                                className={`flex-1 text-center py-3 font-medium transition-colors ${activeTab === "business"
                                                        ? "text-white bg-[#f76f00] rounded-t-xl shadow-md"
                                                        : "text-gray-600 hover:text-[#f76f00] hover:bg-[#FFF8EA]"
                                                    }`}
                                            >
                                                Business Software
                                            </button>

                                            <button
                                                onClick={() => setActiveTab("website")}
                                                className={`flex-1 text-center py-3 font-medium transition-colors ${activeTab === "website"
                                                        ? "text-white bg-[#f76f00] rounded-t-xl shadow-md"
                                                        : "text-gray-600 hover:text-[#f76f00] hover:bg-[#FFF8EA]"
                                                    }`}
                                            >
                                                Website
                                            </button>
                                        </div>

                                        {/* Tab Content */}
                                        <div className="px-6 pt-6 pb-14 text-gray-300 text-sm/6">
                                            {activeTab === "business" && (
                                                <div>
                                                  
                                                </div>
                                            )}

                                            {activeTab === "website" && (
                                                <div>
                                                 
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
