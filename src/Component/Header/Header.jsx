"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm  top-0 w-full z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Go to Home">
            <span className="text-2xl font-bold text-gray-800">Ecom</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            {/* <Link href="/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link> */}
            <Link href="/Cart" className="text-gray-700 hover:text-blue-600">
              Carts
            </Link>
            <Link href="/Aboutus" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link href="/Contactus" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
            <Link
              href="/user/dashboard"
              className="ml-4 px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              Login / Dashboard
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-gray-700"
            aria-label="Open menu"
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-white/30 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-label="Mobile menu"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-700"
            aria-label="Close menu"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-4">
          <Link href="/" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          {/* <Link href="/products" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
            Products
          </Link> */}
          <Link href="../Cart" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
            Carts
          </Link>
          <Link href="../Aboutus" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link href="../Contactus" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          <Link
            href="../user/dashboard"
            className="inline-block mt-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setIsOpen(false)}
          >
            Login / Dashboard
          </Link>
        </nav>
      </aside>
    </header>
  );
}
