import React from "react";

export default function Herobanner() {
    return (
        <div
            className="w-full h-72 lg:h-screen bg-cover bg-center relative flex items-center justify-center"
            style={{ backgroundImage: "url('/images/top-view-mix-nuts-dried-fruits-almonds-raisins-pumpkin-seeds-with-dried-apricots-table.jpg')" }}
        >
            <div className="absolute inset-0  backdrop-blur-sm"></div>

            <div className="relative text-center text-white px-4">
                <h1 className="text-2xl sm-text-5xl md:text-6xl font-bold mb-4">
                    Premium Dry Fruits
                </h1>

             
            </div>
        </div>
    );
}
