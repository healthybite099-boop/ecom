"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// --- Helpers ---
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

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
    if (!userId) return;
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/cart?userId=${encodeURIComponent(userId)}`);
        setCart(res.data?.data || { userId, items: [] });
      } catch (err) {
        setError("Unable to load cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const handleQuantityChange = async (productId, quantity) => {
    try {
      const res = await axios.put("/api/cart", { userId, productId, quantity });
      setCart(res.data?.data || cart);
    } catch (err) { console.error(err); }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const res = await axios.delete("/api/cart", { data: { userId, productId } });
      setCart(res.data?.data || cart);
    } catch (err) { console.error(err); }
  };

  const handleClearCart = async () => {
    try {
      const res = await axios.delete("/api/cart", { data: { userId, clear: true } });
      setCart(res.data?.data || { userId, items: [] });
    } catch (err) { console.error(err); }
  };

  const calculateTotals = () => {
    if (!cart || !cart.items) return { subtotal: 0, itemCount: 0 };
    return cart.items.reduce((acc, item) => {
      const unitPrice = item.product?.finalPrice || item.product?.price || 0;
      acc.subtotal += unitPrice * item.quantity;
      acc.itemCount += item.quantity;
      return acc;
    }, { subtotal: 0, itemCount: 0 });
  };

  const { subtotal, itemCount } = calculateTotals();

  // --- Logic Flow ---
  // 1. Click Checkout -> Validate Login -> Open Modal
  const initiateCheckout = () => {
    if (status !== "authenticated" || userId.startsWith("guest_")) {
      alert("Please login to checkout.");
      router.push("/login");
      return;
    }
    setIsAddressModalOpen(true);
  };

  // 2. Submit Modal -> Start Razorpay
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsAddressModalOpen(false);
    handleRazorpayPayment();
  };

  // 3. Razorpay Payment & API Order Creation
  const handleRazorpayPayment = async () => {
    setCheckingOut(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Razorpay SDK failed");

      const orderRes = await axios.post("/api/razorpay", { amount: subtotal });
      const order = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "WowNutt",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post("/api/orders", {
              userId,
              items: cart.items,
              amount: subtotal,
              shippingAddress: address, // <--- Passing the collected address
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            alert("Order placed successfully!");
            handleClearCart();
            router.push("/profile/orders"); // Redirect to orders page
          } catch (err) {
            alert("Payment recorded, but order failed to save. Contact support.");
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Checkout failed. Try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-white pb-10">
      {/* Sticky Header */}
      <div className="border-b border-amber-100/70 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-slate-600">Home</Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold">Cart</span>
          </div>
          {itemCount > 0 && (
            <button onClick={handleClearCart} className="text-xs text-red-500">Clear cart</button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid lg:grid-cols-[2fr,1fr] gap-6">
        {/* Cart Items List */}
        <div className="space-y-4">
          <h1 className="text-xl font-semibold">Shopping Cart</h1>
          {loading ? (
            <p>Loading...</p>
          ) : !cart?.items?.length ? (
            <div className="bg-white p-10 rounded-2xl text-center border">
              <p>Your cart is empty.</p>
              <Link href="/" className="inline-block mt-4 px-6 py-2 bg-amber-500 text-white rounded-xl">Shop Now</Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <CartItem key={item.product._id} item={item} onQtyChange={handleQuantityChange} onRemove={handleRemoveItem} />
            ))
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 h-fit sticky top-20">
          <h2 className="text-lg font-semibold mb-3">Order summary</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-slate-500"><span>Shipping</span><span>FREE</span></div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span>₹{subtotal}</span></div>
          </div>
          <button
            disabled={checkingOut || !subtotal}
            onClick={initiateCheckout}
            className="w-full mt-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {checkingOut ? "Processing..." : "Checkout Now"}
          </button>
        </div>
      </div>

      {/* --- Address Modal --- */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
            <form onSubmit={handleAddressSubmit} className="space-y-3">
              <input required placeholder="Full Name" className="w-full p-3 rounded-xl border" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
              <input required type="tel" placeholder="Phone Number" className="w-full p-3 rounded-xl border" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
              <textarea required placeholder="Full Address / Street" className="w-full p-3 rounded-xl border" rows="2" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="City" className="w-full p-3 rounded-xl border" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                <input required placeholder="State" className="w-full p-3 rounded-xl border" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
              </div>
              <input required placeholder="Pincode" className="w-full p-3 rounded-xl border" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
              
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="flex-1 py-3 text-slate-500 font-medium">Cancel</button>
                <button type="submit" className="flex-[2] py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600">Pay ₹{subtotal}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for clarity
function CartItem({ item, onQtyChange, onRemove }) {
  const product = item.product || {};
  const unitPrice = product.finalPrice || product.price || 0;
  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-4 flex gap-4">
      <div className="w-20 h-20 bg-amber-50 rounded-xl overflow-hidden shrink-0">
        <Image width={80} height={80} src={product.images?.[0] || ""} alt={product.name} className="object-cover h-full w-full" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
          <button onClick={() => onRemove(product._id)} className="text-red-500 text-xs">Remove</button>
        </div>
        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center gap-3 border rounded-full px-2 py-1">
            <button onClick={() => onQtyChange(product._id, Math.max(1, item.quantity - 1))}>-</button>
            <span className="text-sm">{item.quantity}</span>
            <button onClick={() => onQtyChange(product._id, item.quantity + 1)}>+</button>
          </div>
          <p className="font-bold text-amber-900">₹{unitPrice * item.quantity}</p>
        </div>
      </div>
    </div>
  );
}