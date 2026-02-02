"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaCartPlus, FaUser } from "react-icons/fa";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isLoggedIn = status === "authenticated";

  // --- Redirect Logic ---
  const handleDashboardClick = (e) => {
    e.preventDefault(); // Prevent default Link navigation
    setIsOpen(false);   // Close mobile menu

    if (status === "unauthenticated") {
      router.push("/login"); // or wherever your login page is
    } else if (session?.user?.usertype === "2") {
      router.push("/admin");
    } else {
      router.push("/user/dashboard");
    }
  };

  return (
    <header className="bg-[#f7f3e8] z-50">
      <div className="md:p-4 py-2 px-4">
        <div className="grid grid-cols-3">
          <div className="col-span-1 flex justify-start items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-700"
              aria-label="Open menu"
            >
              <FaBars size={24} color="#653825" />
            </button>
          </div>

          <div className="col-span-1 flex justify-center items-center">
            <Link href="/" aria-label="Go to Home">
              <Image src="/img/logobg.png" className="md:hidden" alt="logo" height={33} width={80} />
              <Image src="/img/logobg.png" className="hidden md:block" alt="logo" height={46} width={110} />
            </Link>
          </div>

          <div className="col-span-1 flex justify-end items-center gap-3">
            {isLoggedIn && (
              <Link href="/Cart">
                <FaCartPlus size={18} color="#653825" />
              </Link>
            )}
            {/* User Icon using the same logic */}
            <button onClick={handleDashboardClick}>
              <FaUser size={18} color="#653825" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-white/30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile menu"
      >
        <div className="flex justify-between items-center p-4 border-b border-[#653825]/30">
          <h2 className="text-lg font-semibold text-[#653825]">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <FaTimes size={22} color="#653825" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-4 text-sm font-medium">
          {[
            { name: "Home", link: "/" },
            { name: "Products", link: "/AllProducts" },
            { name: "Privacy Policy", link: "/privacy-policy" },
            { name: "Refund Policy", link: "/refund-policy" },
            { name: "Terms & Condition", link: "/t&c" },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.link}
              onClick={() => setIsOpen(false)}
              className="block text-[#653825] hover:bg-[#653825]/10 px-3 py-1 rounded-md transition"
            >
              {item.name}
            </Link>
          ))}

          {isLoggedIn && (
            <>
              <Link
                href="/Cart"
                onClick={() => setIsOpen(false)}
                className="block text-[#653825] hover:bg-[#653825]/10 px-3 py-1 rounded-md transition"
              >
                Cart
              </Link>
              <Link
                href="/YourOrder"
                onClick={() => setIsOpen(false)}
                className="block text-[#653825] hover:bg-[#653825]/10 px-3 py-1 rounded-md transition"
              >
                Your Orders
              </Link>
            </>
          )}

          {/* Combined Login / Dashboard Button */}
          <button
            onClick={handleDashboardClick}
            className="w-full text-center inline-block mt-4 px-4 py-2 rounded-full text-sm font-semibold bg-[#653825] text-[#f7f3e8] hover:bg-[#4e2a1c] transition"
          >
            {isLoggedIn ? "Dashboard" : "Login / Register"}
          </button>
        </nav>
      </aside>
    </header>
  );
}