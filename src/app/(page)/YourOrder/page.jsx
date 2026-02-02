"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Package, MapPin, Phone, Calendar, Hash, ChevronRight } from "lucide-react";

export default function PerfectOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const userId = session?.user?.id || session?.user?._id || "";

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (status !== "authenticated" || !userId) return;
      try {
        setLoading(true);
        const params = { userId };
        if (statusFilter !== "all") params.status = statusFilter;
        const res = await axios.get("/api/orders", { params });
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [status, userId, statusFilter]);

  const getStatusBadge = (s) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ";
    const styles = {
      Pending: "bg-[#fffbeb] border-[#fde68a] text-[#92400e]",
      Paid: "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]",
      Shipped: "bg-[#eff6ff] border-[#bfdbfe] text-[#1e40af]",
      Cancelled: "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]",
    };
    return <span className={`${base} ${styles[s] || "bg-white text-gray-500"}`}>{s}</span>;
  };

  if (loading) return <div className="min-h-screen bg-[#f7f3e8] flex items-center justify-center text-[#653825] font-medium">Preparing your order list...</div>;

  return (
    <div className="min-h-screen  text-[#653825] font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* Header Section */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black mb-2 italic">My Purchase History</h1>
          <p className="opacity-80 font-medium">Thank you for choosing our premium dry fruits.</p>
        </header>

        {/* Responsive Filter Bar */}
        <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2 mask-linear-right">
          {["all", "Pending", "Paid", "Shipped", "Cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border-2 ${
                statusFilter === f 
                ? "bg-[#653825] text-[#f7f3e8] border-[#653825] shadow-lg" 
                : "border-[#653825]/20 hover:border-[#653825] text-[#653825]"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Orders Stack */}
        <div className="grid grid-cols-1 gap-8">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="bg-white/50 backdrop-blur-sm rounded-3xl border border-[#653825]/10 overflow-hidden hover:shadow-xl transition-all group">
                
                {/* Top Info Bar */}
                <div className="bg-[#653825]/5 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#653825]/10">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#653825] rounded-lg text-[#f7f3e8]">
                      <Hash size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold opacity-60 uppercase">Order Reference</p>
                      <p className="text-sm font-mono font-bold tracking-tight">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="opacity-60" />
                      <span className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Items List (Left Side) */}
                  <div className="lg:col-span-7 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Cart Items</h3>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#653825]/10 rounded-xl flex items-center justify-center group-hover/item:bg-[#653825]/20 transition-colors">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-base leading-tight">{item.name}</p>
                            <p className="text-xs opacity-70 font-medium">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Billing (Right Side) */}
                  <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#653825]/10 lg:pl-10 pt-8 lg:pt-0">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                        <MapPin size={12} /> Delivery Address
                      </h3>
                      <div className="text-sm leading-relaxed">
                        <p className="font-black text-[#653825] mb-1">{order.shippingAddress?.fullName}</p>
                        <p className="opacity-80">{order.shippingAddress?.street}</p>
                        <p className="opacity-80">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                        <p className="mt-2 flex items-center gap-2 font-bold opacity-90 text-xs">
                          <Phone size={12} /> {order.shippingAddress?.phone}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#653825]/20">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-50 mb-1">Total Paid</p>
                          <p className="text-3xl font-black tracking-tighter">₹{order.amount}</p>
                        </div>
                        <button className="bg-[#653825] text-[#f7f3e8] p-3 rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-[#653825]/20">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white/30 rounded-[3rem] border-2 border-dashed border-[#653825]/20">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold opacity-40 italic">No orders found in your basket.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}