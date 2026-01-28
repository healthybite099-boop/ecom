import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";

export async function GET() {
  try {
    // 1. Connect to DB
    await dbConnect();

    // 2. Fetch Data (Optimized)
    // No 'await Promise.all' with countDocuments needed here, just the data.
    const products = await ProductModel.find(
      { status: "Active" }, // Filter: Only active products
      {
        // Projection: Select ONLY what the card needs
        name: 1,
        images: { $slice: 1 }, // Only fetch the first image (Fast!)
        slug: 1,
        brand: 1,
        price: 1,
        finalPrice: 1,
        discountPercentage: 1,
        isAvailable: 1,
      }
    )
      .sort({ createdAt: -1 }) // Sort: Latest first
      .limit(8) // Limit: Fixed to 8
      .lean(); // Performance: Return plain objects, not Mongoose docs

    // 3. Return Response
    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Latest Products Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}