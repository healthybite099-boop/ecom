"use client";
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="w-full bg-white shadow flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            ANKIT ECOM ADMIN PANEL
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage products and store settings
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <nav className="flex flex-wrap gap-3">
          <Link
            href="/admin/AddProduct"
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Add Product
          </Link>
          <Link
            href="/admin/products"
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
          >
            View Products
          </Link>
        </nav>

        <section className="bg-white rounded-xl shadow p-4 text-sm text-slate-700">
          <p>Welcome to the admin dashboard. Use the links above to manage products.</p>
        </section>
      </main>
    </div>
  );
}
