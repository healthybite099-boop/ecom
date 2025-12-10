"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";

export default function Products() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreRef = useRef(null);

  useEffect(() => {
    fetchProducts(1, false);
  }, []);

  const fetchProducts = useCallback(async (pageToLoad = 1, append = false) => {
    try {
      setError("");
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await axios.get("/api/products/showhome", {
        params: {
          page: pageToLoad,
          limit: 4,
        },
      });

      if (res.data?.success && Array.isArray(res.data.data)) {
        setData((prev) => (append ? [...prev, ...res.data.data] : res.data.data));
        setHasMore(Boolean(res.data.hasMore));
        setPage(pageToLoad);
      } else {
        setError("Unable to load products.");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Something went wrong while fetching products.");
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !isLoadingMore && hasMore) {
          const nextPage = page + 1;
          fetchProducts(nextPage, true);
        }
      },
      { threshold: 0.5 }
    );

    const node = loadMoreRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [fetchProducts, hasMore, isLoadingMore, loading, page]);

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-2xl bg-white/60 shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div className="h-40 bg-gray-200" />
      <div className="p-3 space-y-2.5">
        <div className="h-3.5 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="h-7 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-amber-50 to-white px-4 sm:px-6 lg:px-10 py-10 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-9 w-28 bg-gray-200 rounded-full animate-pulse" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error && !data.length) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
        <p className="text-red-600 font-medium mb-3">{error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:scale-95 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-amber-50/70 via-white to-white py-10 px-4 sm:px-6 lg:px-10">
      {/* Subtle decorative blur in background */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 flex justify-center opacity-40">
        <div className="h-32 w-72 rounded-full bg-gradient-to-r from-yellow-200 via-amber-100 to-orange-100 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap gap-4 justify-between items-start mb-8">
          <div className="space-y-1.5">
            <p className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-yellow-900">
              Premium Collection
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Full Collection
            </h2>
            <p className="text-sm text-gray-500 max-w-md">
              Handpicked dry fruits & premium products curated for quality,
              freshness, and taste.
            </p>
          </div>

          {/* <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex items-center rounded-full border border-yellow-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-yellow-50 transition">
              Today&apos;s picks
            </button>
            <button className="px-4 py-2 rounded-full bg-yellow-400 text-yellow-900 text-sm font-semibold shadow-md hover:bg-yellow-300 active:scale-95 transition">
              View All Products
            </button>
          </div> */}
        </div>

        {/* Categories */}
        {data.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-500">
              No products available right now. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {data.map((cat) => (
              <section
                key={cat.categoryId}
                className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Category Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-1 rounded-full bg-gradient-to-b from-yellow-400 to-amber-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {cat.categoryName}
                        </h3>
                       
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Fresh, quality-assured {cat.categoryName?.toLowerCase()}.
                      </p>
                    </div>
                  </div>

                  <button className="text-[11px] sm:text-xs font-semibold text-yellow-700 rounded-full border border-yellow-100 bg-yellow-50/60 px-3 py-1 hover:bg-yellow-100 transition">
                    View {cat.categoryName}
                  </button>
                </div>

                {/* Products grid (compact, professional) */}
                <div className="pt-2">
                  {/* Horizontal scroll on mobile, grid on larger screens */}
                  <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4 sm:overflow-visible">
                    {cat.products?.map((product) => (
                      <div
                        key={product._id}
                        className="min-w-[160px] max-w-[190px] sm:min-w-0 sm:max-w-none"
                      >
                        <ProductCard
                          name={product.name}
                          price={product.finalPrice}
                          brand={product.brand}
                          image={product.images?.[0]}
                          slug={product.slug}
                        />
                      </div>
                    ))}

                    {/* If category empty */}
                    {(!cat.products || cat.products.length === 0) && (
                      <div className="flex items-center justify-center py-6 text-xs text-gray-400">
                        No products in this category yet.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}
            {hasMore && (
              <div
                ref={loadMoreRef}
                className="flex items-center justify-center py-4 text-xs text-gray-400"
              >
                {isLoadingMore ? "Loading more products..." : "Scroll to load more"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
