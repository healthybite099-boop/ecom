"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

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

async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const [userId, setUserId] = useState("");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/cart?userId=${encodeURIComponent(userId)}`);
        setCart(res.data?.data || { userId, items: [] });
        setError("");
      } catch (err) {
        console.error("Cart fetch error:", err);
        setError("Unable to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const handleQuantityChange = async (productId, quantity) => {
    if (!userId) return;
    try {
      const res = await axios.put("/api/cart", {
        userId,
        productId,
        quantity,
      });
      setCart(res.data?.data || cart);
    } catch (err) {
      console.error("Update cart error:", err);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!userId) return;
    try {
      const res = await axios.delete("/api/cart", {
        data: { userId, productId },
      });
      setCart(res.data?.data || cart);
    } catch (err) {
      console.error("Remove cart item error:", err);
    }
  };

  const handleClearCart = async () => {
    if (!userId) return;
    try {
      const res = await axios.delete("/api/cart", {
        data: { userId, clear: true },
      });
      setCart(res.data?.data || { userId, items: [] });
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  const calculateTotals = () => {
    if (!cart || !cart.items) return { subtotal: 0, itemCount: 0 };

    return cart.items.reduce(
      (acc, item) => {
        const product = item.product || {};
        const unitPrice = product.finalPrice || product.price || 0;
        const qty = item.quantity || 0;
        acc.subtotal += unitPrice * qty;
        acc.itemCount += qty;
        return acc;
      },
      { subtotal: 0, itemCount: 0 }
    );
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) return;

    const { subtotal } = calculateTotals();
    if (!subtotal || subtotal <= 0) return;

    setCheckingOut(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Please check your connection.");
        setCheckingOut(false);
        return;
      }

      const orderRes = await axios.post("/api/razorpay", {
        amount: subtotal,
      });

      const order = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Ecom Store",
        description: "Order payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post("/api/orders", {
              userId,
              items: cart.items,
              amount: subtotal,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            alert("Payment successful! Thank you for your order.");
            handleClearCart();
          } catch (err) {
            console.error("Error saving order:", err);
            alert("Payment captured but failed to save order. Please check admin panel.");
          }
        },
        prefill: {},
        notes: {
          userId,
        },
        theme: {
          color: "#16a34a",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Unable to start payment. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  const { subtotal, itemCount } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-white">
      <div className="border-b border-amber-100/70 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-slate-600 hover:text-amber-800">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Cart</span>
          </div>
          {itemCount > 0 && (
            <button
              onClick={handleClearCart}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear cart
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid lg:grid-cols-[2fr,1fr] gap-6">
        <div className="space-y-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Shopping Cart
          </h1>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl border border-amber-100 p-4 text-sm text-slate-500">
              Loading cart...
            </div>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-amber-100 p-6 text-center text-sm text-slate-500">
              <p>Your cart is empty.</p>
              <Link
                href="/"
                className="inline-flex mt-3 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs sm:text-sm hover:bg-amber-600"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.map((item) => {
                const product = item.product || {};
                const unitPrice = product.finalPrice || product.price || 0;
                const lineTotal = unitPrice * (item.quantity || 0);

                return (
                  <div
                    key={product._id || Math.random()}
                    className="bg-white rounded-2xl border border-amber-100 p-3 sm:p-4 flex gap-3 sm:gap-4"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-amber-50 overflow-hidden flex-shrink-0">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-2 text-xs sm:text-sm">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900 line-clamp-2">
                            {product.name}
                          </p>
                          {product.brand && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {product.brand}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(product._id)}
                          className="text-[11px] text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product._id,
                                Math.max(1, (item.quantity || 1) - 1)
                              )
                            }
                            className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-700"
                          >
                            -
                          </button>
                          <span className="min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product._id,
                                (item.quantity || 1) + 1
                              )
                            }
                            className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-700"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            ₹{lineTotal}
                          </p>
                          {unitPrice !== lineTotal && (
                            <p className="text-[11px] text-slate-500">
                              ₹{unitPrice} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-4 sm:p-5 h-fit">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
            Order summary
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="border-t border-amber-100 mt-3 pt-3 flex justify-between items-center text-sm font-semibold text-slate-900">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          <button
            disabled={checkingOut || !subtotal}
            onClick={handleCheckout}
            className={`w-full mt-4 py-3 rounded-2xl text-sm font-semibold shadow-sm transition ${
              subtotal
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {checkingOut ? "Processing..." : "Checkout with Razorpay"}
          </button>
        </div>
      </div>
    </div>
  );
}

