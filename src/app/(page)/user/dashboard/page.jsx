"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const STATUS_OPTIONS = ["Pending", "Paid", "Shipped", "Cancelled"];

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const userId = session?.user?.id || session?.user?._id || "";

  const fetchOrders = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError("");

      const params = { userId };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const res = await axios.get("/api/orders", { params });
      const mine = res.data?.data || [];
      setOrders(mine);
    } catch (err) {
      console.error("Fetch user orders error:", err);
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && userId) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, userId, statusFilter]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">
        Checking session...
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-sm text-slate-700">
        <p className="mb-3">Please login to view your dashboard.</p>
        <Link
          href="/login"
          className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Your Orders</h1>
            <p className="text-xs text-slate-500">
              View and filter all orders placed with your account.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/Cart"
              className="px-3 py-2 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Go to Cart
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-3 py-2 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 border border-slate-200 rounded-lg bg-white text-xs"
            >
              <option value="all">All</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-4 text-sm text-slate-500">Loading your orders...</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">
              You have no orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Order</th>
                    <th className="px-3 py-2 text-left font-semibold">Amount</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                    <th className="px-3 py-2 text-left font-semibold">Items</th>
                    <th className="px-3 py-2 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-3 py-2 align-top">
                        <div className="font-mono text-[11px] break-all max-w-[220px]">
                          {order._id}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {order.razorpayOrderId || "-"}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-emerald-700 font-semibold">
                        ₹{order.amount}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-700">
                        <ul className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <li key={idx}>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-slate-500"> x{item.quantity}</span>
                              <span className="ml-1 text-slate-500">(₹{item.price})</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "-"}
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
