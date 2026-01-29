"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.length > 10 && 
      formData.password.trim() !== "" &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/user/create", { ...formData, usertype: "1" });
      if (res.data?.success) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(res.data?.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] flex justify-center items-center min-h-screen p-4">
      {/* Aesthetic Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#2d2849]"></div>

      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#2d2849]">Join Us</h2>
          <p className="text-gray-500 mt-2">Create your account to get started</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-xs text-red-600 rounded-lg text-center border border-red-100">{error}</div>}
        {success && <div className="mb-4 p-3 bg-emerald-50 text-xs text-emerald-600 rounded-lg text-center border border-emerald-100">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#2d2849] focus:bg-white outline-none transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#2d2849] focus:bg-white outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Phone Number</label>
            <PhoneInput
              country={"in"}
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              inputStyle={{ width: '100%', height: '44px', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
              buttonStyle={{ borderRadius: '12px 0 0 12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••"
                className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#2d2849] focus:bg-white outline-none transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Confirm</label>
              <input
                type="password"
                placeholder="••••••"
                className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#2d2849] focus:bg-white outline-none transition-all"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className="w-full mt-4 py-3 bg-[#2d2849] text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#1f1b33] disabled:bg-gray-300 transform active:scale-95 transition-all"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-amber-700 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}