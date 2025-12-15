"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
    return (
        <Link
            href="https://wa.me/916367436349?text=Hi%20I’m%20interested%20in%20premium%20dry%20fruits.%20"
            target="_blank"
            aria-label="Chat on WhatsApp"
            className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        bg-green-500 hover:bg-green-600
        text-white
       p-2
        rounded-full
        shadow-lg
        transition-all duration-300
        hover:scale-105
      "
        >
            <FaWhatsapp className="w-6 h-6" />

        </Link>
    );
}
