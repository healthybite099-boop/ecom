import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import CategoryModel from "@/model/Category";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
    const pageSize = Number.isNaN(limit) || limit < 1 ? 5 : limit;
    const skip = (currentPage - 1) * pageSize;

    const categories = await CategoryModel.find(
      { status: "Active" },
      { _id: 1, name: 1, slug: 1 }
    )
      .skip(skip)
      .limit(pageSize)
      .lean();

    const result = await Promise.all(
      categories.map(async (cat) => {
        const products = await ProductModel.find(
          { category: cat._id.toString(), status: "Active" },
          {
            name: 1,
            images: 1,
            slug: 1,
            brand: 1,
            price: 1,
            discountPercentage: 1,
            finalPrice: 1,
            weight: 1,
            isAvailable: 1,
          }
        )
          .sort({ createdAt: -1 })
          .limit(6)
          .lean();

        if (products.length === 0) return null;

        return {
          categoryId: cat._id,
          categoryName: cat.name,
          slug: cat.slug,
          products,
        };
      })
    );

    const filtered = result.filter((item) => item !== null);

    const hasMore = filtered.length > 0 && categories.length === pageSize;

    return NextResponse.json(
      { success: true, data: filtered, page: currentPage, hasMore },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
