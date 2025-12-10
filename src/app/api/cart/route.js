import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/Cart";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    const cart = await CartModel.findOne({ userId }).populate("items.product");

    return NextResponse.json(
      {
        success: true,
        data: cart || { userId, items: [] },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, productId, quantity = 1 } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "userId and productId are required" },
        { status: 400 }
      );
    }

    const qty = Math.max(1, Number(quantity) || 1);

    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = await CartModel.create({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { userId, productId, quantity } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "userId and productId are required" },
        { status: 400 }
      );
    }

    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    const idx = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (idx === -1) {
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    const qty = Number(quantity) || 0;
    if (qty <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = qty;
    }

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { userId, productId, clear } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return NextResponse.json(
        { success: true, data: { userId, items: [] } },
        { status: 200 }
      );
    }

    if (clear) {
      cart.items = [];
    } else if (productId) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    }

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
