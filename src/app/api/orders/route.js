import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Order";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      userId,
      items,
      amount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (!userId || !Array.isArray(items) || items.length === 0 || !amount) {
      return NextResponse.json(
        { success: false, message: "userId, items and amount are required" },
        { status: 400 }
      );
    }

    const mappedItems = items.map((item) => ({
      product: item.product?._id || item.product,
      name: item.product?.name || item.name,
      price: item.product?.finalPrice || item.product?.price || item.price,
      quantity: item.quantity,
    }));

    const order = await OrderModel.create({
      userId,
      items: mappedItems,
      amount,
      status: "Paid",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (userId) {
      filter.userId = userId;
    }

    const orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
