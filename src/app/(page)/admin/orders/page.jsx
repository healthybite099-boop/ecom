"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const STATUS_OPTIONS = ["Pending", "Paid", "Shipped", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // For Address/Action Modal
  const [showShipModal, setShowShipModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/orders");
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch (err) { alert("Failed to update status"); }
  };

  const handleAssignShipping = async (method) => {
    try {
      const res = await axios.post(`/api/shipping/assign`, {
        orderId: selectedOrder._id,
        method: method // "Self" or "NimbusPost"
      });
      
      if (res.data.success) {
        alert(`Order assigned to ${method} successfully!`);
        fetchOrders();
        setShowShipModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Shipping assignment failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Order Logistics Management</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">Customer & ID</th>
                <th className="p-4">Address Info</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Shipping</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{order.shippingAddress?.fullName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{order._id}</div>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => { setSelectedOrder(order); }}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View Full Address
                    </button>
                    <div className="text-slate-500 text-xs">{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</div>
                  </td>
                  <td className="p-4 max-w-[200px]">
                    {order.items?.map(i => <div key={i.name} className="truncate text-xs">{i.quantity}x {i.name}</div>)}
                  </td>
                  <td className="p-4 font-bold text-emerald-600">₹{order.amount}</td>
                  <td className="p-4">
                    {order.shippingMethod === "None" ? (
                      <button 
                        onClick={() => { setSelectedOrder(order); setShowShipModal(true); }}
                        className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-amber-200"
                      >
                        Assign Shipping
                      </button>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-blue-600">{order.shippingMethod}</span>
                        <span className="text-[10px] text-slate-400">{order.awbNumber || "Pending AWB"}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs border rounded-lg p-1"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Address Detail Modal --- */}
      {selectedOrder && !showShipModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div><p className="text-[10px] uppercase text-slate-400 font-bold">Customer</p><p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p></div>
              <div><p className="text-[10px] uppercase text-slate-400 font-bold">Contact</p><p className="font-medium">{selectedOrder.shippingAddress?.phone}</p></div>
              <div><p className="text-[10px] uppercase text-slate-400 font-bold">Street Address</p><p className="font-medium text-sm">{selectedOrder.shippingAddress?.street}</p></div>
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-[10px] uppercase text-slate-400 font-bold">City/State</p><p className="font-medium">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p></div>
                <div><p className="text-[10px] uppercase text-slate-400 font-bold">Pincode</p><p className="font-medium">{selectedOrder.shippingAddress?.pincode}</p></div>
              </div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="w-full mt-6 py-3 bg-slate-900 text-white rounded-2xl font-bold">Close</button>
          </div>
        </div>
      )}

      {/* --- Shipping Assignment Modal --- */}
      {showShipModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">🚚</div>
            <h2 className="text-xl font-bold mb-2">Accept & Ship Order</h2>
            <p className="text-sm text-slate-500 mb-6">Choose how you want to fulfill this order. NimbusPost will automatically generate an AWB.</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleAssignShipping("NimbusPost")}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Assign NimbusPost
              </button>
              <button 
                onClick={() => handleAssignShipping("Self")}
                className="w-full py-4 bg-slate-100 text-slate-800 rounded-2xl font-bold hover:bg-slate-200 transition"
              >
                Self Delivery
              </button>
              <button onClick={() => setShowShipModal(false)} className="text-slate-400 text-sm font-medium mt-4">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}