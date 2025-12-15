"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Truck, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [userId, setUserId] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const realUserId = session?.user?.id || session?.user?._id || "";
      if (realUserId) {
        setUserId(realUserId);
        return;
      }
    }

    const id = getOrCreateUserId();
    setUserId(id);
  }, [session, status]);

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
    if (status !== "authenticated") {
      setShowAuthPopup(true);
      return;
    }

    if (!product || !product._id || !userId) return;
    try {
      setCartLoading(true);
      await axios.post("/api/cart", {
        userId,
        productId: product._id,
        quantity: qty,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl animate-pulse space-y-4">
          <div className="h-12 bg-amber-100 rounded" />
          <div className="h-96 bg-amber-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-white flex items-center justify-center px-4">
        <div className="bg-white/95 shadow-lg rounded-3xl p-8 text-center max-w-md mx-auto border border-amber-100">
          <p className="text-lg font-semibold text-red-500 mb-2">Product not found</p>
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
    stock = 0,
    isAvailable = false,
  } = product;

  const displayPrice = finalPrice || price;
  const inStock = isAvailable && stock > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-white pb-12">
      {/* TOP BAR */}
      <div className="border-b border-amber-100/70 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1 hover:text-amber-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/products">Products</Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/** KEY CHANGE: Use single column by default, switch to two columns at md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* LEFT: Large image + thumbs */}
          <div>
            <div
              className="relative rounded-2xl overflow-hidden bg-amber-50/80 shadow-lg border border-amber-100"
              style={{ minHeight: 620 }}
            >
              <Image
                src={mainImage}
                alt={name}
                fill
                priority
                className="object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(img)}
                      className={`flex-shrink-0 rounded-md p-1 transition border ${
                        (mainImage || images[0]) === img
                          ? "ring-2 ring-amber-300 border-amber-200"
                          : "border-transparent hover:ring-1 hover:ring-amber-100"
                      }`}
                    >
                      <Image
                        width={84}
                        height={84}
                        src={`https:${img}`}
                        alt={`${name} ${i + 1}`}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: summary, price, CTA */}
          {/* sticky applied from md and up */}
          <aside className="md:sticky md:top-24">
            <div className="mb-4">
              <p className="inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-amber-800 bg-amber-50/80 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                Premium Dry Fruit
              </p>

              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                {name}
              </h1>

              <div className="flex items-center gap-3 mt-3 text-sm text-slate-600">
                {brand && <span className="uppercase font-medium">{brand}</span>}
                {rating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
                    <Star className="w-3 h-3" />
                    <strong>{rating.toFixed(1)}</strong>
                    <span className="text-slate-400 ml-1">({reviewsCount})</span>
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-b border-amber-100/70 py-4 mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-3xl font-bold text-emerald-700">₹{displayPrice}</div>
                  {discountPercentage > 0 && (
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-400 line-through">₹{price}</span>
                      <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">{discountPercentage}% OFF</span>
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-1">Inclusive of all taxes</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-600 min-w-[90px]">Quantity</label>

                <div className="inline-flex items-center border rounded-2xl px-3 py-1.5 gap-4">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-md text-lg flex items-center justify-center hover:bg-amber-50 transition"
                    aria-label="decrease"
                  >
                    −
                  </button>
                  <div className="min-w-[36px] text-center font-medium">{qty}</div>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-8 h-8 rounded-md text-lg flex items-center justify-center hover:bg-amber-50 transition"
                    aria-label="increase"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || cartLoading}
                  className={`w-full py-3 rounded-full text-sm font-semibold transition shadow-sm ${
                    inStock && !cartLoading ? "bg-white border-2 border-amber-800 text-amber-800 hover:shadow-md" : "bg-slate-100 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {inStock ? (cartLoading ? "Adding..." : "Add to cart") : "Out of Stock"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!inStock || cartLoading}
                  className="w-full py-3 rounded-full text-sm font-semibold bg-amber-800 text-white hover:bg-amber-900 transition disabled:opacity-60"
                >
                  Buy now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Truck className="w-5 h-5 text-amber-700" />
                <div>
                  <div className="font-semibold text-slate-800 text-sm">Fast Delivery</div>
                  <div className="text-xs">Dispatch 1–2 days</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <div className="font-semibold text-slate-800 text-sm">Quality Assured</div>
                  <div className="text-xs">Premium grade</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className={`h-3 w-3 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"} mt-1`} />
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{inStock ? `In stock • ${stock}` : "Out of stock"}</div>
                  <div className="text-xs">Availability</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* BOTTOM: description & details */}
        <div className="mt-8 grid lg:grid-cols-[1.6fr,1fr] gap-6">
          <div className="bg-white/95 rounded-3xl shadow-sm p-6 border border-amber-100">
            <h2 className="text-lg font-semibold mb-3">About this product</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {description || "Detailed description will be available soon."}
            </p>

            {tags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-slate-100 text-xs text-slate-700">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white/95 rounded-3xl shadow-sm p-4 border border-amber-100">
              <h3 className="font-semibold mb-2">Key details</h3>
              <dl className="text-sm text-slate-700 space-y-2">
                {brand && <div className="flex justify-between"><dt className="text-slate-500">Brand</dt><dd className="font-medium">{brand}</dd></div>}
                {category && <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd className="font-medium capitalize">{category}</dd></div>}
                {weight && <div className="flex justify-between"><dt className="text-slate-500">Weight</dt><dd className="font-medium">{weight} g</dd></div>}
                {shelfLife && <div className="flex justify-between"><dt className="text-slate-500">Shelf life</dt><dd className="font-medium">{shelfLife}</dd></div>}
                {originCountry && <div className="flex justify-between"><dt className="text-slate-500">Origin</dt><dd className="font-medium">{originCountry}</dd></div>}
              </dl>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-4 border border-slate-100">
              <h3 className="font-semibold mb-2">Customer reviews</h3>
              <p className="text-sm text-slate-500">Review system can be integrated later. Currently showing <strong>{rating}</strong>★ from <strong>{reviewsCount}</strong> ratings.</p>
            </div>
          </div>
        </div>
      </div>

      {showAuthPopup && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-lg font-semibold mb-2 text-slate-900">Login required</h2>
            <p className="text-sm text-slate-600 mb-4">
              Please login or sign up with your mobile number to continue.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowAuthPopup(false);
                  router.push("/login");
                }}
                className="w-full py-2.5 rounded-full text-sm font-semibold bg-amber-800 text-white hover:bg-amber-900 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowAuthPopup(false);
                  router.push("/register");
                }}
                className="w-full py-2.5 rounded-full text-sm font-semibold border border-amber-800 text-amber-800 bg-white hover:bg-amber-50 transition"
              >
                Sign up
              </button>
              <button
                onClick={() => setShowAuthPopup(false)}
                className="w-full py-2 rounded-full text-xs text-slate-500 hover:text-slate-700"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
