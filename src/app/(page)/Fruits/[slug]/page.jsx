"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Truck, ShieldCheck } from "lucide-react";
import Image from "next/image";
function getOrCreateUserId() {
  if (typeof window === "undefined") return "";
  const key = "ecom_guest_user_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [userId, setUserId] = useState("");
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/single/${slug}`);
        const data = res.data?.data;
        setProduct(data || null);

        if (data?.images?.[0]) {
          setMainImage(data.images[0]);
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product || !product._id || !userId) return;
    try {
      setCartLoading(true);
      await axios.post("/api/cart", {
        userId,
        productId: product._id,
        quantity: 1,
      });
      setCartLoading(false);
      router.push("/Cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
  };

  // ================== LOADING SKELETON ==================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-white">
        <div className="border-b bg-white/80 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-amber-100 animate-pulse" />
            <div className="h-4 w-40 rounded bg-amber-100 animate-pulse" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          <div className="h-7 bg-amber-100 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-amber-50 rounded w-1/3 animate-pulse" />

          <div className="bg-white/90 rounded-3xl shadow-sm ring-1 ring-amber-100/60 p-4 sm:p-6 lg:p-8 grid lg:grid-cols-2 gap-6 animate-pulse">
            <div className="space-y-3">
              <div className="w-full h-64 sm:h-80 bg-amber-50 rounded-2xl" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 rounded-xl"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-amber-50 rounded w-1/3" />
              <div className="h-4 bg-amber-50 rounded w-1/2" />
              <div className="h-4 bg-amber-50 rounded w-2/3" />
              <div className="h-10 bg-amber-50 rounded w-full" />
              <div className="h-10 bg-amber-50 rounded w-2/3" />
              <div className="h-10 bg-amber-50 rounded w-1/2" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="h-40 bg-white/90 rounded-2xl shadow-sm ring-1 ring-amber-100/60" />
            <div className="h-40 bg-white/90 rounded-2xl shadow-sm ring-1 ring-amber-100/60" />
          </div>
        </div>
      </div>
    );
  }

  // ================== NOT FOUND ==================
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-white flex items-center justify-center px-4">
        <div className="bg-white/95 shadow-lg rounded-3xl p-8 text-center max-w-md mx-auto border border-amber-100">
          <p className="text-lg font-semibold text-red-500 mb-2">
            Product not found
          </p>
          <p className="text-slate-500 mb-6 text-sm">
            The product you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-200 text-sm bg-amber-50/70 hover:bg-amber-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ================== MAIN PAGE ==================
  const {
    name,
    type,
    brand,
    category,
    price = 0,
    finalPrice,
    discountPercentage = 0,
    weight,
    packagingType,
    shelfLife,
    originCountry,
    qualityGrade,
    nutrition,
    images = [],
    description,
    rating = 0,
    reviewsCount = 0,
    tags = [],
    sku,
    stock = 0,
    isAvailable = false,
  } = product;

  const displayPrice = finalPrice || price;
  const inStock = isAvailable && stock > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-white">
      {/* TOP BAR */}
      <div className="border-b border-amber-100/70 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1 hover:text-amber-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <span className="hidden sm:inline text-slate-300">|</span>

            <div className="hidden sm:flex items-center gap-1">
              <Link href="/" className="hover:underline hover:text-amber-800">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:underline hover:text-amber-800">
                Products
              </Link>
              {slug && (
                <>
                  <span>/</span>
                  <span className="capitalize text-slate-500 truncate max-w-[150px]">
                    {slug}
                  </span>
                </>
              )}
            </div>
          </div>


        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 lg:space-y-8">
        {/* TITLE + RATING STRIP */}
        <header className="space-y-1">
          <p className="inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-amber-800 bg-amber-50/80 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
            Premium Dry Fruit
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mt-1">
            {name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500">
            {brand && (
              <span className="uppercase tracking-wide font-medium">
                {brand}
              </span>
            )}
            {name && (
              <>
                <span>•</span>
                <span className="capitalize">{name}</span>
              </>
            )}
            {type && (
              <>
                <span>•</span>
                <span className="capitalize">{type}</span>
              </>
            )}
          </div>

          {rating > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-semibold">{rating.toFixed(1)}</span>
              </span>
              <span className="text-slate-500">
                {reviewsCount} verified ratings
              </span>
            </div>
          )}
        </header>

        {/* HERO CARD: IMAGE + SUMMARY */}
        <section className="bg-white/95 rounded-3xl shadow-lg ring-1 ring-amber-100/80 p-4 sm:p-6 lg:p-8 grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT – IMAGE GALLERY */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-amber-50/80 aspect-[4/3]">
              <Image
              fill
                src={mainImage || images[0]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 rounded-xl border p-1 transition ${(mainImage || images[0]) === img
                        ? "border-amber-500 ring-1 ring-amber-100"
                        : "border-slate-200 hover:border-amber-300"
                      }`}
                  >
                    <Image
                      fill
                      src={img}
                      alt={`${name} ${i + 1}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT – PRODUCT SUMMARY */}
          <div className="flex flex-col h-full">
            {/* PRICE BLOCK */}
            <div className="border-b border-amber-100/80 pb-4 mb-4">
              <div className="flex items-end gap-3 flex-wrap">
                <p className="text-2xl sm:text-3xl font-semibold text-emerald-700">
                  ₹{displayPrice}
                </p>
                {discountPercentage > 0 && (
                  <p className="text-slate-400 line-through text-sm sm:text-base">
                    ₹{price}
                  </p>
                )}
                {discountPercentage > 0 && (
                  <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] sm:text-xs text-slate-500">
                Inclusive of all taxes
              </p>
            </div>

            {/* QUICK BULLET HIGHLIGHTS */}
            <ul className="space-y-1 text-xs sm:text-sm text-slate-700 mb-4">
              {weight && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {weight}g hygienically packed
                </li>
              )}
              {shelfLife && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Shelf life: {shelfLife}
                </li>
              )}
              {originCountry && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Sourced from {originCountry}
                </li>
              )}
              {qualityGrade && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Grade {qualityGrade} quality
                </li>
              )}
            </ul>

            {/* INFO CHIPS */}
            <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs mb-4">
              {packagingType && (
                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {packagingType}
                </span>
              )}
              {category && (
                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                  {category}
                </span>
              )}
              {type && (
                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                  {type}
                </span>
              )}
            </div>

            {/* DELIVERY + QUALITY CARDS */}
            <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs mb-4">
              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-3 flex items-start gap-2">
                <Truck className="w-4 h-4 mt-0.5 text-amber-700" />
                <div>
                  <p className="font-semibold text-slate-900 text-xs">
                    Fast Delivery
                  </p>
                  <p className="text-slate-600">
                    Dispatch within 1–2 business days.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-emerald-700" />
                <div>
                  <p className="font-semibold text-slate-800 text-xs">
                    Quality Assured
                  </p>
                  <p className="text-slate-500">
                    Handpicked, premium grade dry fruits.
                  </p>
                </div>
              </div>
            </div>

            {/* STOCK + CTA */}
            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"
                      }`}
                  />
                  <span className={inStock ? "text-emerald-700" : "text-red-600"}>
                    {inStock
                      ? `In stock • ${stock} packs available`
                      : "Currently out of stock"}
                  </span>
                </div>
                <span className="hidden sm:inline text-[11px] text-slate-400">
                  Category: DryFruitProduct
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || cartLoading}
                  className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition shadow-sm ${inStock && !cartLoading
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md"
                      : "bg-slate-100 text-slate-500 cursor-not-allowed"
                    }`}
                >
                  {inStock ? (cartLoading ? "Adding..." : "Add to Cart") : "Out of Stock"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock || cartLoading}
                  className="sm:w-32 py-3 rounded-2xl text-sm font-medium border border-amber-200 text-amber-800 bg-amber-50/80 hover:bg-amber-100 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTIONS */}
        <section className="grid lg:grid-cols-[1.6fr,1fr] gap-6">
          {/* LEFT: DESCRIPTION + NUTRITION */}
          <div className="space-y-4">
            {/* DESCRIPTION CARD */}
            <div className="bg-white/95 rounded-3xl shadow-sm p-4 sm:p-5 border border-amber-100">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                About this product
              </h2>
              <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                {description || "Detailed description will be available soon."}
              </p>

              {tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full bg-slate-100 text-[11px] sm:text-xs text-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* NUTRITION CARD */}
            {nutrition && (
              <div className="bg-white/95 rounded-3xl shadow-sm p-4 sm:p-5 border border-amber-100">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
                  Nutritional Information (per 100g)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-xs sm:text-sm">
                  {nutrition.calories != null && (
                    <div className="flex justify-between border-b border-slate-100 py-1">
                      <span className="text-slate-500">Calories</span>
                      <span className="font-medium">
                        {nutrition.calories} kcal
                      </span>
                    </div>
                  )}
                  {nutrition.protein != null && (
                    <div className="flex justify-between border-b border-slate-100 py-1">
                      <span className="text-slate-500">Protein</span>
                      <span className="font-medium">
                        {nutrition.protein} g
                      </span>
                    </div>
                  )}
                  {nutrition.fat != null && (
                    <div className="flex justify-between border-b border-slate-100 py-1">
                      <span className="text-slate-500">Fat</span>
                      <span className="font-medium">
                        {nutrition.fat} g
                      </span>
                    </div>
                  )}
                  {nutrition.carbs != null && (
                    <div className="flex justify-between border-b border-slate-100 py-1">
                      <span className="text-slate-500">Carbs</span>
                      <span className="font-medium">
                        {nutrition.carbs} g
                      </span>
                    </div>
                  )}
                  {nutrition.fiber != null && (
                    <div className="flex justify-between border-b border-slate-100 py-1">
                      <span className="text-slate-500">Fiber</span>
                      <span className="font-medium">
                        {nutrition.fiber} g
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: QUICK DETAILS + REVIEWS PLACEHOLDER */}
          <div className="space-y-4">
            {/* QUICK DETAILS */}
            <div className="bg-white/95 rounded-3xl shadow-sm p-4 sm:p-5 border border-amber-100 text-sm">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
                Key details
              </h2>
              <dl className="space-y-2 text-xs sm:text-sm">
                {brand && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Brand</dt>
                    <dd className="font-medium text-slate-800 text-right">
                      {brand}
                    </dd>
                  </div>
                )}
                {category && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Category</dt>
                    <dd className="font-medium text-slate-800 text-right capitalize">
                      {category}
                    </dd>
                  </div>
                )}
                {type && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Type</dt>
                    <dd className="font-medium text-slate-800 text-right capitalize">
                      {type}
                    </dd>
                  </div>
                )}
                {weight && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Weight</dt>
                    <dd className="font-medium text-slate-800 text-right">
                      {weight} g
                    </dd>
                  </div>
                )}
                {packagingType && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Packaging</dt>
                    <dd className="font-medium text-slate-800 text-right">
                      {packagingType}
                    </dd>
                  </div>
                )}
                {shelfLife && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Shelf life</dt>
                    <dd className="font-medium text-slate-800 text-right">
                      {shelfLife}
                    </dd>
                  </div>
                )}
                {originCountry && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Origin</dt>
                    <dd className="font-medium text-slate-800 text-right">
                      {originCountry}
                    </dd>
                  </div>
                )}
                {qualityGrade && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Quality grade</dt>
                    <dd className="font-medium text-slate-800 text-right">
                      {qualityGrade}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* REVIEWS PLACEHOLDER */}
            <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-5 border border-slate-100 text-sm">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                Customer reviews
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Review system can be integrated here later. Currently showing{" "}
                <span className="font-semibold">{rating}</span>★ from{" "}
                <span className="font-semibold">{reviewsCount}</span> ratings.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
