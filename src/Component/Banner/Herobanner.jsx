import React from "react";

export default function Herobanner() {
    return (
        <div
            className="w-full h-96 lg:h-screen bg-cover bg-center relative flex items-center justify-center"
            style={{ backgroundImage: "url('/images/top-view-mix-nuts-dried-fruits-almonds-raisins-pumpkin-seeds-with-dried-apricots-table.jpg')" }}
        >
            <div className="absolute inset-0  backdrop-blur-sm"></div>

            <div className="relative text-center text-white px-4">
                <h1 className="text-2xl sm-text-5xl md:text-6xl font-bold mb-4">
                    Premium Dry Fruits
                </h1>

                <button className="bg-yellow-400 text-brown-800 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition">
                    Shop Now
                </button>
            </div>
        </div>
    );
}
