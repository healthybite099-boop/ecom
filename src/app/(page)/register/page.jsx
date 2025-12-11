"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/user/create", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        usertype: "1",
      });

      if (!res.data?.success) {
        setError(res.data?.message || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess("Registered successfully. You can now login.");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || "Server error during registration");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 flex justify-center items-center min-h-screen relative">
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>

      <div className="relative z-30 bg-white p-8 sm:p-10 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-emerald-600 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
              Mobile Number
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your mobile number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="Re-enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`w-full py-2.5 px-4 rounded-lg shadow-lg text-sm font-semibold transition ${
              isFormValid() && !loading
                ? "bg-amber-800 text-white hover:bg-amber-900"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
