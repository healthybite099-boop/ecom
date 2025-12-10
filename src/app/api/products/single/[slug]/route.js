import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";

export async function GET(
  request,
  { params } // ⬅️ this is NOT a promise, but `params` itself IS
) {
  try {
    // 👇 unwrap the Promise
    const { slug } = await params;

    console.log("Fetching product with slug:", slug);

    await dbConnect();

    const product = await ProductModel.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
