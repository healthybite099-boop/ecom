import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/Category";

// Utility function to generate slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove invalid chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

// Ensure slug is unique
async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  while (await CategoryModel.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function POST(req) {
  try {
    await dbConnect();
    const { name, status } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // Generate base slug
    const baseSlug = slugify(name);

    // Generate unique slug
    const slug = await generateUniqueSlug(baseSlug);

    const category = await CategoryModel.create({
      name,
      slug,
      status: status || "Active",
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}


// 🔹 GET with pagination + status filter
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status"); // "Active" | "Inactive" | null

    const skip = (page - 1) * limit;

    // Base filter
    const filter = { defaultdata: "Category" };

    // 🔹 Server-side status filter
    if (status === "Active" || status === "Inactive") {
      filter.status = status;
    }

    const [categories, totalItems] = await Promise.all([
      CategoryModel.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit),
      CategoryModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return NextResponse.json(
      {
        success: true,
        data: categories,
        page,
        totalPages,
        totalItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
