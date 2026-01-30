"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Truck, ShieldCheck, ChevronRight, Info, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

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
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [userId, setUserId] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const realUserId = session?.user?.id || session?.user?._id || "";
      if (realUserId) { setUserId(realUserId); return; }
    }
    setUserId(getOrCreateUserId());
  }, [session, status]);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/single/${slug}`);
        setProduct(res.data?.data || null);
      } catch (error) {
        console.error("Product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async (redirectToCart = true) => {
    if (status !== "authenticated") {
      setShowAuthPopup(true);
      return;
    }
    if (!product?._id || !userId) return;
    try {
      setCartLoading(true);
      await axios.post("/api/cart", {
        userId,
        productId: product._id,
        quantity: qty,
      });
      if (redirectToCart) router.push("/Cart");
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fdf9f1] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-amber-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return <div className="text-center py-20 text-[#653825]">Product not found.</div>;

  const inStock = product.isAvailable && product.stock > 0;

  return (
    <div className="min-h-screen bg-[#fdf9f1] pb-12">
      {/* STICKY NAV */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[#653825] font-semibold hover:opacity-70 transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-amber-800">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#653825]">{product.name}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: TOUCH SLIDER (5 Columns) */}
          <div className="lg:col-span-5 space-y-4 overflow-hidden">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-amber-900/5 border border-amber-100">
              <Swiper
                spaceBetween={10}
                navigation={false}
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                className="aspect-square group"
              >
                {product.images?.map((img, i) => (
                  <SwiperSlide key={i} className="flex items-center justify-center p-6 md:p-12">
                    <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-700">
                      <Image src={img} alt={product.name} fill priority className="object-contain" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {product.discountPercentage > 0 && (
                <div className="absolute top-6 left-6 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {product.discountPercentage}% Off
                </div>
              )}
            </div>

            {/* Thumbnail Track */}
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={12}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="px-1"
            >
              {product.images?.map((img, i) => (
                <SwiperSlide key={i} className="cursor-pointer">
                  <div className="relative aspect-square rounded-2xl bg-white border-2 border-transparent transition-all overflow-hidden swiper-thumb-active:border-[#653825]">
                    <Image src={img} fill alt="thumb" className="object-contain p-2" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* RIGHT: CONTENT (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-block bg-[#653825]/10 text-[#653825] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                {product.brand || "WOWNUTT Premium"}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-[#3b2224] mb-2">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating || "4.9"}</span>
                </div>
                <span className="text-slate-400 text-sm">({product.reviewsCount || "0"} Reviews)</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-amber-100 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-[#653825]">₹{product.finalPrice || product.price}</span>
                {product.discountPercentage > 0 && (
                  <span className="text-xl text-slate-300 line-through">₹{product.price}</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 uppercase mt-2 font-bold tracking-tighter">Tax included • Free Shipping on ₹500+</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-white border border-amber-100 rounded-2xl p-1 shadow-sm">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-amber-50 rounded-xl text-2xl font-bold text-[#653825]"> – </button>
                <span className="w-12 text-center font-bold text-lg">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-amber-50 rounded-xl text-2xl font-bold text-[#653825]"> + </button>
              </div>

              <button 
                onClick={() => handleAddToCart(true)}
                disabled={!inStock || cartLoading}
                className=" h-14 md:flex-1   bg-[#653825] text-white rounded-2xl font-bold text-lg hover:bg-amber-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-900/20"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartLoading ? "Adding..." : "Buy Now"}
              </button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-white">
                <Truck className="text-amber-700 w-6 h-6" />
                <span className="text-sm font-bold text-slate-700">Fast Delivery (2-3 Days)</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-white">
                <ShieldCheck className="text-emerald-700 w-6 h-6" />
                <span className="text-sm font-bold text-slate-700">100% Quality Assurance</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-16 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-[#3b2224] flex items-center gap-2">
              <Info className="w-5 h-5" /> About the product
            </h3>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-amber-100 text-slate-600 leading-relaxed">
              {product.description}
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-amber-100 h-fit">
            <h3 className="font-bold text-[#3b2224] mb-4">Quick Specs</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Weight</span><span className="font-bold text-[#653825]">{product.weight}g</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Shelf Life</span><span className="font-bold text-[#653825]">{product.shelfLife}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Packaging</span><span className="font-bold text-[#653825]">{product.packagingType}</span></div>
            </div>
          </div>
        </div>
      </main>

      {/* Auth Popup */}
      {showAuthPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3b2224]/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-[#3b2224] mb-4">Login to continue</h2>
            <button onClick={() => router.push("/login")} className="w-full py-4 bg-[#653825] text-white rounded-2xl font-bold mb-3">Login</button>
            <button onClick={() => setShowAuthPopup(false)} className="text-slate-400 font-medium">Cancel</button>
          </div>
        </div>
      )}

      {/* Global CSS for Swiper Customization */}
      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev { color: #653825 !important; background: white; width: 35px !important; height: 35px !important; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .swiper-button-next:after, .swiper-button-prev:after { font-size: 14px !important; font-weight: 800; }
        .swiper-pagination-bullet-active { background: #653825 !important; }
        .swiper-slide-thumb-active div { border-color: #653825 !important; }
      `}</style>
    </div>
  );
}