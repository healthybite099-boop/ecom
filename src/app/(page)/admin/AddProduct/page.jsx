"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    sku: "",
    price: "",
    discountPercentage: "",
    finalPrice: "",
    weight: "",
    stock: "",
    packagingType: "",
    shelfLife: "",
    originCountry: "",
    qualityGrade: "",
    description: "",
    category: "", 
  });

  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/categories", { params: { limit: 55 } });
      setCategories(res.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discountPercentage) || 0;
    const discounted = discount > 0 && discount <= 100 
      ? price - (price * discount) / 100 
      : price;

    setFormData((prev) => ({
      ...prev,
      finalPrice: price > 0 ? discounted.toFixed(2) : "",
    }));
  }, [formData.price, formData.discountPercentage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["price", "discountPercentage", "finalPrice", "weight", "stock"];
    if (numericFields.includes(name)) {
      const cleaned = value.replace(/[^0-9.]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🖼️ Perfect Image Handling
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Append new files to state
    setImageFiles((prev) => [...prev, ...files]);

    // Create and append previews
    const newPreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    
    // Reset input so same file can be selected again if removed
    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].url);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      if (imageFiles.length === 0) {
        setErrorMsg("Please select at least one product image.");
        return;
      }
      if (!formData.category) {
        setErrorMsg("Please select a category.");
        return;
      }

      setLoading(true);

      const uploadFormData = new FormData();
      imageFiles.forEach((file) => uploadFormData.append("files", file));

      const uploadRes = await axios.post("/api/upload", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrls = uploadRes.data?.urls || [];

      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        discountPercentage: Number(formData.discountPercentage || 0),
        finalPrice: Number(formData.finalPrice) || 0,
        weight: Number(formData.weight) || 0,
        stock: Number(formData.stock || 0),
        images: imageUrls,
      };

      await axios.post("/api/products", payload);
      setSuccessMsg("Product added successfully!");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Error adding product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-yellow-50 flex items-start justify-center p-6 md:p-10 text-gray-800">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-green-100 p-6 md:p-10 space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 tracking-tight">Add New Product</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your store listings.</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">New Entry</span>
          </div>
        </div>

        {/* Status Messages */}
        {successMsg && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{successMsg}</div>}
        {errorMsg && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMsg}</div>}

        {/* Category Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Select Category *</label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="">Choose a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">Product Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Product Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" placeholder="e.g., Premium Almonds" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Type *</label>
              <input required type="text" name="type" value={formData.type} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" placeholder="Organic" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Brand *</label>
              <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">SKU Code *</label>
              <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">Pricing & Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Price *</label>
              <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Discount %</label>
              <input type="text" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Final Price</label>
              <input readOnly type="text" name="finalPrice" value={formData.finalPrice} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-bold text-green-700" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Stock *</label>
              <input required type="text" name="stock" value={formData.stock} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" />
            </div>
          </div>
        </section>

        {/* Packaging */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">Packaging & Origin</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input required type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" placeholder="Weight (g)" />
            <input required type="text" name="packagingType" value={formData.packagingType} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" placeholder="Packaging (e.g. Box)" />
            <input required type="text" name="shelfLife" value={formData.shelfLife} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" placeholder="Shelf Life" />
            <input required type="text" name="originCountry" value={formData.originCountry} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500" placeholder="Origin" />
            <select required name="qualityGrade" value={formData.qualityGrade} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500">
              <option value="">Quality Grade</option>
              <option value="A">A</option>
              <option value="AA">AA</option>
              <option value="AAA">AAA</option>
            </select>
          </div>
        </section>

        {/* Description */}
        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-green-800">Description</h3>
          <textarea required name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-green-500" placeholder="Product details..."></textarea>
        </section>

        {/* 🖼️ Perfect Visual Image Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-800">Product Images *</h3>
            <span className="text-xs text-gray-400">{imageFiles.length} images selected</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Existing Previews */}
            {imagePreviews.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl border-2 border-gray-100 overflow-hidden bg-white shadow-sm">
                <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {/* 🆕 "Add On" Box - Always visible to add more */}
            <label className="relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-green-300 rounded-xl bg-green-50/50 cursor-pointer hover:bg-green-100 transition-colors group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex flex-col items-center text-green-600">
                <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase mt-1">Add Image</span>
              </div>
            </label>
          </div>
          <p className="text-[11px] text-gray-400 italic">Click the "+" box to add more images at any time.</p>
        </section>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg hover:bg-green-700 disabled:bg-green-300 transition-all active:scale-[0.98]"
          >
            {loading ? "Publishing..." : "Submit Product"}
          </button>
        </div>
      </form>
    </div>
  );
}