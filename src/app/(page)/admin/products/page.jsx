"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/products");
      const all = res.data?.data || [];

      let filtered = all;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter((p) => {
          return (
            p.name?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.sku?.toLowerCase().includes(q)
          );
        });
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((p) => (p.status || "Active") === statusFilter);
      }

      setProducts(filtered);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Products</h1>
            <p className="text-xs text-slate-500">
              Search and manage all products in your store.
            </p>
          </div>
          <Link
            href="/admin/AddProduct"
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
          >
            + Add Product
          </Link>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-wrap items-center gap-3 bg-white rounded-xl p-3 shadow"
        >
          <input
            type="text"
            placeholder="Search by name, brand, or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
          >
            <option value="all">All status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            Apply
          </button>
        </form>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-4 text-sm text-slate-500">Loading products...</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Name</th>
                    <th className="px-3 py-2 text-left font-semibold">Brand</th>
                    <th className="px-3 py-2 text-left font-semibold">SKU</th>
                    <th className="px-3 py-2 text-left font-semibold">Price</th>
                    <th className="px-3 py-2 text-left font-semibold">Stock</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-3 py-2">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 truncate max-w-[180px]">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {p.slug}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-700">{p.brand}</td>
                      <td className="px-3 py-2 text-slate-700">{p.sku}</td>
                      <td className="px-3 py-2 text-slate-700">₹{p.finalPrice ?? p.price}</td>
                      <td className="px-3 py-2 text-slate-700">{p.stock}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            (p.status || "Active") === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {p.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
