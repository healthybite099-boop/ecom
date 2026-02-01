"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CategoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Pagination + filter state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All"); // All | Active | Inactive
  const [listLoading, setListLoading] = useState(false);

  // Fetch categories (with pagination & status filter)
  const getCategories = async (currentPage = page, currentStatus = statusFilter) => {
    try {
      setListLoading(true);

      const params = {
        page: currentPage,
        limit: 5,
      };

      if (currentStatus !== "All") {
        params.status = currentStatus;
      }

      const res = await axios.get("/api/categories", { params });

      setCategories(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setListLoading(false);
    }
  };

  // Initial + whenever page / status changes
  useEffect(() => {
    getCategories(page, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/categories", formData);
      setFormData({ name: "", status: "Active" });

      // After adding, go back to first page (optional)
      setPage(1);
      getCategories(1, statusFilter);
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    setPage(1); // reset to first page on filter change
  };

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex gap-6">
      {/* ---------------- Left Category List ---------------- */}
      <div className="w-2/3 bg-white shadow-md rounded-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">All Categories</h2>

          {/* 🔹 Server-side status filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Status: </label>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-300"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 h-[65vh] overflow-y-auto pr-2">
          {listLoading ? (
            <p className="text-center text-gray-500 text-sm">Loading categories...</p>
          ) : categories.length > 0 ? (
            categories.map((item, index) => (
              <div
                key={item._id || index}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-semibold text-gray-700">{item.name}</p>
                  <p className="text-xs text-gray-500 break-all">
                    Slug: {item.slug}
                  </p>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    item.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No categories found</p>
          )}
        </div>

        {/* 🔹 Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ---------------- Right Add Form ---------------- */}
      <div className="w-1/3">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 border sticky top-6"
        >
          <h2 className="text-xl font-semibold text-center mb-5 text-indigo-600">
            Add Category
          </h2>

          <div className="mb-4">
            <label className="text-sm font-medium">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

        

          <div className="mb-4">
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-300"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
