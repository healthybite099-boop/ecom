"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

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
    category: "", // 🆕 will store category _id
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

      const params = {
        limit: 55,
      };

      const res = await axios.get("/api/categories", { params });

      setCategories(res.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    getCategories();
  }, []);

  // 🔢 Auto-calculate final price whenever price or discount changes
  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discountPercentage) || 0;

    const discounted =
      discount > 0 && discount <= 100
        ? price - (price * discount) / 100
        : price;

    setFormData((prev) => ({
      ...prev,
      finalPrice: discounted ? discounted.toFixed(2) : "",
    }));
  }, [formData.price, formData.discountPercentage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For numeric fields, restrict to numbers and dot
    const numericFields = [
      "price",
      "discountPercentage",
      "finalPrice",
      "weight",
      "stock",
    ];

    if (numericFields.includes(name)) {
      const cleaned = value.replace(/[^0-9.]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);

    // Generate previews
    const previews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      if (!imageFiles || imageFiles.length === 0) {
        setErrorMsg("Please select at least one product image.");
        return;
      }

      if (!formData.category) {
        setErrorMsg("Please select a category.");
        return;
      }

      setLoading(true);

      // 🔼 Upload images
      const uploadFormData = new FormData();
      imageFiles.forEach((file) => uploadFormData.append("files", file));

      const uploadRes = await axios.post("/api/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrls = uploadRes.data?.urls || [];

      if (!imageUrls.length) {
        setErrorMsg("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }

      // 📦 Prepare payload
      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        discountPercentage: Number(formData.discountPercentage || 0),
        finalPrice: Number(formData.finalPrice) || 0,
        weight: Number(formData.weight) || 0,
        stock: Number(formData.stock || 0),
        images: imageUrls,
        category: formData.category, // 🆕 send selected _id
      };

      await axios.post("/api/products", payload);

      setSuccessMsg("Product added successfully!");
      window.location.reload();
      setFormData({
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
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.response?.data?.message || "Error adding product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-yellow-50 flex items-start justify-center p-6 md:p-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-green-100 p-6 md:p-10 space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 tracking-tight">
              Add New Product
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details below to list a new product in your store.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
              Select Category
            </span>
            <span className="text-xs text-gray-400">
              All fields marked with <span className="text-red-500">*</span> are
              required.
            </span>
          </div>
        </div>

        {/* Status Messages */}
        {successMsg && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        {/* Category Select */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">
            Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Select Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="category"
                value={formData._id}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="" >
                  Choose a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400">
                This will be saved as the category ID in the product.
              </p>
            </div>
          </div>
        </section>

        {/* Product Basic Info */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">
            Product Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="e.g., Premium Almonds"
              />
              <p className="text-xs text-gray-400">
                Enter a clear and searchable product title.
              </p>
            </div>

            {/* Type */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Organic / Premium / Standard"
              />
              <p className="text-xs text-gray-400">
                Helps users filter product quality/category.
              </p>
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="e.g., NutHarvest, FarmFresh"
              />
            </div>

            {/* SKU */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                SKU Code <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Unique inventory code"
              />
            </div>
          </div>
        </section>

        {/* Pricing & Stock */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">
            Pricing & Stock
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Price */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Price (MRP) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="e.g., 599"
              />
              <p className="text-xs text-gray-400">Base price before discount.</p>
            </div>

            {/* Discount */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Discount (%)
              </label>
              <input
                type="text"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="0 - 100"
              />
              <p className="text-xs text-gray-400">
                Leave empty if no discount.
              </p>
            </div>

            {/* Final Price */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Final Price <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="finalPrice"
                value={formData.finalPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Auto-calculated"
                readOnly
              />
              <p className="text-xs text-green-600">
                Auto-calculated based on price & discount.
              </p>
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Available units"
              />
            </div>
          </div>
        </section>

        {/* Packaging & Origin */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">
            Packaging & Origin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weight */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Weight (grams) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="e.g., 250, 500"
              />
            </div>

            {/* Packaging Type */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Packaging Type <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="packagingType"
                value={formData.packagingType}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Zip Pouch / Jar"
              />
            </div>

            {/* Shelf Life */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Shelf Life <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="e.g., 6 Months"
              />
            </div>

            {/* Origin Country */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Origin Country <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="originCountry"
                value={formData.originCountry}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="e.g., India, USA"
              />
            </div>

            {/* Quality Grade */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Quality Grade <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="qualityGrade"
                value={formData.qualityGrade}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="" disabled>
                  Select Quality
                </option>
                <option value="A">A</option>
                <option value="AA">AA</option>
                <option value="AAA">AAA</option>
              </select>
              <p className="text-xs text-gray-400">
                Select product grade/quality level.
              </p>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-green-800">
            Description
          </h3>
          <textarea
            required
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="Describe the product in detail – taste, texture, usage, health benefits, etc."
          ></textarea>
          <p className="text-xs text-gray-400">
            A clear description helps customers understand why this product is
            special.
          </p>
        </section>

        {/* Images */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-green-800">
            Product Images <span className="text-red-500">*</span>
          </h3>
          <div className="border-2 border-dashed border-green-300 rounded-xl p-4 bg-green-50/40">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full cursor-pointer text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Upload high quality images (you can select multiple). At least one
              image is required.
            </p>

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreviews.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="h-28 w-full object-cover"
                    />
                    <div className="px-2 py-1 text-[10px] text-gray-500 truncate">
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {loading ? "Saving Product..." : "Submit Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
