import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";

// Function to generate slug from name
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Function to create a unique slug
const createUniqueSlug = async (baseSlug) => {
  let uniqueSlug = baseSlug;
  let count = 1;

  while (await ProductModel.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${count}`;
    count++;
  }

  return uniqueSlug;
};

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      name,
      type,
      brand,
      sku,
      price,
      discountPercentage,
      finalPrice,
      weight,
      stock,
      packagingType,
      shelfLife,
      originCountry,
      qualityGrade,
      description,
      images,
      tags,
      status,
      category
    } = body;

    if (!name || !type || !brand || !sku || !price || !finalPrice || !weight || !packagingType || !shelfLife || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }

    // ⭐ Generate slug
    const baseSlug = generateSlug(name);
    const uniqueSlug = await createUniqueSlug(baseSlug);

    const product = await ProductModel.create({
      name,
      slug: uniqueSlug,       // <-- NEW
      type,
      brand,
      sku,
      price: Number(price),
      discountPercentage: Number(discountPercentage || 0),
      finalPrice: Number(finalPrice),
      weight: Number(weight),
      stock: Number(stock || 0),
      packagingType,
      shelfLife,
      originCountry: originCountry || "India",
      qualityGrade: qualityGrade || "AA",
      description,
      images,
      tags: tags && Array.isArray(tags) ? tags : [],
      status: status || "Active",
      category
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const products = await ProductModel.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
