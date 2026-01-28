"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaSortAmountDown,
  FaChevronRight,
  FaRedoAlt
} from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const brandBrown = '#653825';
  const brandCream = '#f7f3e8';

  const sentinelRef = useRef(null);
  const pageRef = useRef(page);

  // Synchronize the ref with the state so the observer always sees the correct page
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // --- Core Fetch Function ---
  const fetchProducts = useCallback(
    async (pageToLoad = 1, append = false) => {
      try {
        if (append) setIsLoadingMore(true);
        else setLoading(true);

        const res = await axios.get("/api/products/allcategory", {
          params: {
            page: pageToLoad,
            limit: 12,
            category: selectedCategory === "all" ? "" : selectedCategory,
            search: appliedSearch,
            sort: sortOrder,
          },
        });

        if (res?.data?.success) {
          const incoming = res.data.data || [];
          setProducts((prev) => (append ? [...prev, ...incoming] : incoming));

          // If we receive fewer items than our limit, there is no more data
          setHasMore(incoming.length === 12);
          setPage(pageToLoad);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to sync items.");
      } finally {
        setIsLoadingMore(false);
        setLoading(false);
      }
    },
    [selectedCategory, appliedSearch, sortOrder]
  );

  // Initial load or filter change
  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  // Load Categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get("/api/categories", { params: { status: "Active" } });
        if (res?.data?.success) setCategories(res.data.data);
      } catch (e) { console.error(e); }
    };
    loadCategories();
  }, []);

  // --- Fixed Infinite Scroll Observer ---
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          const nextPage = pageRef.current + 1;
          fetchProducts(nextPage, true);
        }
      },
      {
        root: null,
        rootMargin: "400px", // Pre-load when user is 400px from bottom
        threshold: 0
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loading, fetchProducts]);

  return (
    <div style={{ backgroundColor: brandCream }} className="min-h-screen pb-10 font-sans text-[#653825]">

      {/* HEADER / NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-stone-200/50 px-4 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <h1 className="hidden md:block text-xl font-black italic tracking-tighter shrink-0">RAW PREMIUM</h1>

          <div className="flex-1 relative group flex items-center">
            <FaSearch className="absolute left-4 text-stone-400 text-sm pointer-events-none" />

            <input
              type="text"
              placeholder="Search our collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setAppliedSearch(searchTerm)}
              className="w-full pl-10 pr-24 py-2.5 bg-stone-100/60 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#653825]/10 transition-all outline-none"
            />

            {/* BUTTON GROUP INSIDE SEARCH BAR */}
            <div className="absolute right-2 flex items-center gap-1">
              {/* CLEAR BUTTON (Only shows if there is text) */}
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(""); setAppliedSearch(""); }}
                  className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                  title="Clear search"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}

              {/* APPLY / SEARCH BUTTON */}
              <button
                onClick={() => setAppliedSearch(searchTerm)}
                className="bg-[#653825] text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl hover:bg-[#4a291b] transition-colors shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex md:hidden items-center justify-center p-2.5 bg-[#653825] text-white rounded-2xl shadow-lg"
          >
            <FaFilter className="text-xs" />
          </button>

        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">

        {/* MOBILE CATEGORY SCROLL */}
        <div className="md:hidden flex gap-2 overflow-x-auto py-5 no-scrollbar">
          {[{ _id: 'all', name: 'All Products' }, ...categories].map((cat) => (
            <button
              key={cat._id}
              onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-extrabold border transition-all ${selectedCategory === cat._id
                  ? 'bg-[#653825] border-[#653825] text-white shadow-md'
                  : 'bg-white border-stone-200 text-stone-500'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-10 md:mt-6">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:block w-52 shrink-0 sticky top-24 h-fit">
            <div className="space-y-8">
              <section>
                <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-400 mb-4">Categories</h3>
                <div className="flex flex-col gap-1">
                  {[{ _id: 'all', name: 'All Products' }, ...categories].map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                      className={`text-left py-2 px-3 rounded-xl text-sm transition-all flex items-center justify-between group ${selectedCategory === cat._id
                          ? 'bg-white text-[#653825] font-bold shadow-sm'
                          : 'text-stone-500 hover:text-[#653825] hover:translate-x-1'
                        }`}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory === cat._id && <FaChevronRight className="text-[10px]" />}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-400 mb-4">Sort By</h3>
                <div className="relative bg-white border border-stone-200 rounded-2xl p-1 shadow-sm">
                  <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full bg-transparent pl-8 pr-3 py-2 text-xs font-bold outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Default</option>
                    <option value="price_asc">Price: Low-High</option>
                    <option value="price_desc">Price: High-Low</option>
                  </select>
                </div>
              </section>
            </div>
          </aside>

          {/* MAIN PRODUCT AREA */}
          <main className="flex-1">
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-stone-200">
                <p className="text-stone-400 font-bold mb-4">No matching items found</p>
                <button onClick={() => { setSelectedCategory('all'); setAppliedSearch('') }} className="text-xs flex items-center gap-2 text-[#653825] font-black underline hover:opacity-70 transition-opacity">
                  <FaRedoAlt /> CLEAR ALL FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
                  {products.map((product) => (
                    <div key={product._id} className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-forwards">
                      <ProductCard
                        name={product.name}
                        price={product.price}
                        finalprice={product.finalPrice}
                        brand={product.brand}
                        image={product.images?.[0]}
                        slug={product.slug}
                      />
                    </div>
                  ))}
                </div>

                {/* SCROLL SENTINEL */}
                <div
                  ref={sentinelRef}
                  className="w-full h-32 flex items-center justify-center mt-8"
                >
                  {isLoadingMore && (
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-[#653825] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-[#653825] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-[#653825] rounded-full animate-bounce" />
                    </div>
                  )}
                  {!hasMore && products.length > 0 && (
                    <p className="text-stone-400 text-xs font-bold tracking-widest uppercase">You've reached the end</p>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET MODAL */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ease-in-out md:hidden ${isFilterModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          onClick={() => setIsFilterModalOpen(false)}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isFilterModalOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
          <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-8" />

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-[#653825]">Filter</h2>
            <button onClick={() => setIsFilterModalOpen(false)} className="p-2 bg-stone-100 rounded-full">
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[{ _id: 'all', name: 'All Products' }, ...categories].map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setPage(1);
                  setIsFilterModalOpen(false);
                }}
                className={`py-4 px-4 rounded-2xl text-xs font-bold border transition-all ${selectedCategory === cat._id
                    ? 'bg-[#653825] border-[#653825] text-white shadow-xl scale-[1.02]'
                    : 'bg-stone-50 border-stone-100 text-stone-500'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-stone-100">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-stone-400 mb-4">Price Sort</h3>
            <div className="flex gap-3">
              <button
                onClick={() => { setSortOrder('price_asc'); setIsFilterModalOpen(false); }}
                className={`flex-1 py-3 rounded-xl border text-xs font-bold ${sortOrder === 'price_asc' ? 'bg-[#653825] text-white' : 'bg-white border-stone-200'}`}
              >
                Low to High
              </button>
              <button
                onClick={() => { setSortOrder('price_desc'); setIsFilterModalOpen(false); }}
                className={`flex-1 py-3 rounded-xl border text-xs font-bold ${sortOrder === 'price_desc' ? 'bg-[#653825] text-white' : 'bg-white border-stone-200'}`}
              >
                High to Low
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SkeletonCard = () => (
  <div className="bg-white rounded-[2.5rem] p-3 animate-pulse shadow-sm">
    <div className="aspect-square bg-stone-100 rounded-[2rem] mb-4" />
    <div className="px-2 space-y-3 pb-4">
      <div className="h-3 w-1/3 bg-stone-100 rounded-full" />
      <div className="h-4 w-full bg-stone-100 rounded-full" />
      <div className="h-8 w-full bg-stone-100 rounded-xl" />
    </div>
  </div>
);