"use client";
import React, { useState } from "react";
import Image from 'next/image'
export default function HomeBanner() {
    const [activeTab, setActiveTab] = useState("business");
    return (
        <>
            <div className="border-b border-gray-200 h-64 overflow-hidden  bg-red-200">
             <Image src="/images/2.png" alt="Home Banner" width={500} height={200} className=" h-96 w-full"/>
            </div>
        </>
    )
}
