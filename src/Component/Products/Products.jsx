"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState(""); // "price_desc" | "price_asc" | ""
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const pageRef = useRef(page); // keep latest page for observer callback
  pageRef.current = page;

  // helper: merge categories by id and dedupe products by _id
  const mergeCategories = (prevCategories, incomingCategories) => {
    if (!prevCategories || prevCategories.length === 0) return incomingCategories || [];

    const map = new Map();
    // initialize map with prev categories
    prevCategories.forEach((c) => {
      const id = c.categoryId ?? c._id ?? c.categoryName;
      map.set(id, {
        ...c,
        products: Array.isArray(c.products) ? [...c.products] : [],
      });
    });

    (incomingCategories || []).forEach((inc) => {
      const id = inc.categoryId ?? inc._id ?? inc.categoryName;
      const existing = map.get(id);
      if (!existing) {
        map.set(id, { ...inc, products: Array.isArray(inc.products) ? [...inc.products] : [] });
      } else {
        // merge products deduped by _id
        const existingProducts = existing.products || [];
        const newProducts = (inc.products || []).filter(
          (p) => !existingProducts.some((ep) => ep._id === p._id)
        );
        existing.products = [...existingProducts, ...newProducts];
        // optionally update other metadata like totalCount
        if (inc.totalCount) existing.totalCount = inc.totalCount;
      }
    });

    return Array.from(map.values());
  };

  const fetchProducts = useCallback(
    async (pageToLoad = 1, append = false, overrideSearch) => {
      const controller = new AbortController();
      try {
        setError("");
        if (append) setIsLoadingMore(true);
        else setLoading(true);

        const res = await axios.get("/api/products/showhome", {
          params: {
            page: pageToLoad,
            limit: 12,
            category: selectedCategory,
            search: overrideSearch ?? appliedSearch,
            sort: sortOrder,
          },
          signal: controller.signal,
        });

        if (res?.data?.success && Array.isArray(res.data.data)) {
          const incoming = res.data.data;
          setProducts((prev) => (append ? [...prev, ...incoming] : incoming));
          setHasMore(Boolean(res.data.hasMore));
          setPage(pageToLoad);
        } else {
          setError("Unable to load products.");
        }
      } catch (err) {
        if (axios.isCancel?.(err) || err.name === "CanceledError") {
          // request cancelled — ignore
        } else {
          console.error("Error fetching products:", err);
          setError("Something went wrong while fetching products.");
        }
      } finally {
        if (append) setIsLoadingMore(false);
        else setLoading(false);
      }

      return () => controller.abort();
    },
    [selectedCategory, appliedSearch, sortOrder]
  );

  // initial load
  useEffect(() => {
    fetchProducts(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load categories for filter select
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get("/api/categories", {
          params: { status: "Active", limit: 1000 },
        });
        if (res?.data?.success && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    loadCategories();
  }, []);

  // intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    // If an observer already exists, disconnect it first
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && !isLoadingMore && hasMore && !loading) {
          // load next page
          fetchProducts(pageRef.current + 1, true);
        }
      },
      { threshold: 0.6 }
    );

    const node = sentinelRef.current;
    if (node) observerRef.current.observe(node);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [fetchProducts, hasMore, isLoadingMore, loading]);

  const SkeletonCard = () => (
    <div className="rounded-2xl bg-white/60 shadow-sm ring-1 ring-gray-100 overflow-hidden animate-pulse">
      <div className="h-72 bg-gray-200" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="h-9 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#f6f0e0] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#4b1b23] mb-6">Our Products</h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !products.length) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 bg-[#f6f0e0]">
        <p className="text-red-600 font-medium mb-3">{error}</p>
        <button
          onClick={() => fetchProducts(1, false)}
          className="px-4 py-2 rounded-full bg-[#4b1b23] text-white text-sm font-semibold hover:opacity-95 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleCategoryChange = async (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setPage(1);
    pageRef.current = 1;
  };

  const handleSortChange = async (e) => {
    const value = e.target.value;
    setSortOrder(value);
    setPage(1);
    pageRef.current = 1;
  };

  const handleApplySearch = async () => {
    setAppliedSearch(searchTerm);
    setSelectedCategory(selectedCategory)
    setSortOrder(sortOrder)
    setPage(1);
    pageRef.current = 1;
    await fetchProducts(1, false, searchTerm);
  };

  return (
    <div className="relative bg-[#f6f0e0] py-12">
      <div className=" container mx-auto lg:w-[90%]">
        <div className="flex flex-col gap-4 mb-4 sm:mb-8 px-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[#4b1b23]">Our Products</h1>
            <p className="text-sm text-[#5d4a4b] mt-1 max-w-xl">
              Handpicked dry fruits & premium products curated for quality, freshness, and taste.
            </p>
          </div>

          {/* desktop / tablet filters */}
          <div className="hidden md:flex w-full md:w-auto flex-col gap-2 md:flex-row md:items-center md:justify-end">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full md:w-40 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b1b23]/40"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="w-full md:w-40 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b1b23]/40"
            >
              <option value="">Sort By</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
            </select>

            <div className="flex w-full md:w-auto items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name"
                className="flex-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b1b23]/40"
              />
              <button
                onClick={handleApplySearch}
                className="px-4 py-2 rounded-full bg-[#4b1b23] text-white text-xs font-semibold hover:opacity-95 transition"
              >
                Apply
              </button>
            </div>
          </div>

          {/* mobile filter trigger */}
          <div className="flex md:hidden w-full ">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="inline-flex items-center gap-2 rounded bg-white px-4 py-1   text-xs font-semibold text-[#4b1b23] shadow-sm border border-gray-200"
            >
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* mobile filter modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-40 flex items-end justify-center md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsFilterModalOpen(false)}
            />
            <div className="relative z-50 w-full max-w-md rounded-t-3xl bg-white p-4 shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">Filter Products</h2>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="text-xs text-gray-500"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b1b23]/40"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Sort By
                  </label>
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="w-full rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b1b23]/40"
                  >
                    <option value="">Default</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="price_asc">Price: Low to High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-gray-600">
                    Search by name
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name"
                      className="flex-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b1b23]/40"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        await handleApplySearch();
                        setIsFilterModalOpen(false);
                      }}
                      className="px-4 py-2 rounded-full bg-[#4b1b23] text-white text-xs font-semibold hover:opacity-95 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 px-5">
          {products.length === 0 && !loading && (
            <div className="py-16 text-center text-sm text-gray-500">No products found.</div>
          )}

          {products.length > 0 && (
            <div className="grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product._id}>
                  <ProductCard
                    name={product.name}
                    price={product.finalPrice ?? product.price}
                    brand={product.brand}
                    image={product.images?.[0]}
                    slug={product.slug}
                  />
                </div>
              ))}
            </div>
          )}

          {loading && products.length > 0 && (
            <div className="mt-4 grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {hasMore && (
            <div
              ref={sentinelRef}
              className="flex items-center justify-center py-4 text-xs text-[#6b4b4d]"
            >
              {isLoadingMore ? "Loading more products..." : "Scroll to load more"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
