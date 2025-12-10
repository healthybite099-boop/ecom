"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const STATUS_OPTIONS = ["Pending", "Paid", "Shipped", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/orders");
      setOrders(res.data?.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/orders/${id}` , { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Admin - Orders</h1>
        {error && (
          <p className="text-sm text-red-600 mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-sm text-slate-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-slate-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Order ID</th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Items</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-3 py-2 align-top text-xs">
                      <div className="font-mono text-[11px] break-all">
                        {order._id}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {order.razorpayOrderId || "-"}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-xs text-slate-700">
                      {order.userId}
                    </td>
                    <td className="px-3 py-2 align-top text-xs font-semibold text-emerald-700">
                      ₹{order.amount}
                    </td>
                    <td className="px-3 py-2 align-top text-xs">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border border-slate-300 rounded-lg px-2 py-1 text-xs bg-white"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 align-top text-xs text-slate-700">
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
                    <td className="px-3 py-2 align-top text-xs text-slate-500">
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
  );
}
