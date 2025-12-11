import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import CategoryModel from "@/model/Category";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const categoryId = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
    const pageSizeRaw = Number.isNaN(limit) || limit < 1 ? 12 : limit;
    const MAX_PAGE_SIZE = 50;
    const pageSize = Math.min(pageSizeRaw, MAX_PAGE_SIZE);
    const skip = (currentPage - 1) * pageSize;

    const filter = { status: "Active" };

    if (categoryId && categoryId !== "all") {
      filter.category = categoryId;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    let sortQuery = { createdAt: -1 };
    if (sort === "price_desc") {
      sortQuery = { finalPrice: -1, price: -1 };
    } else if (sort === "price_asc") {
      sortQuery = { finalPrice: 1, price: 1 };
    }

    const [products, totalItems] = await Promise.all([
      ProductModel.find(filter, {
        name: 1,
        images: 1,
        slug: 1,
        brand: 1,
        price: 1,
        discountPercentage: 1,
        finalPrice: 1,
        weight: 1,
        isAvailable: 1,
        category: 1,
      })
        .sort(sortQuery)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      ProductModel.countDocuments(filter),
    ]);

    const hasMore = skip + products.length < totalItems;

    return NextResponse.json(
      {
        success: true,
        data: products,
        page: currentPage,
        hasMore,
        totalItems,
      },
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
