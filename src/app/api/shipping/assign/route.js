import { NextResponse } from "next/server";
import OrderModel from "@/model/Order";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";

export async function POST(req) {
  try {
    await dbConnect();
    const { orderId, method } = await req.json();
    const order = await OrderModel.findById(orderId);

    if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });

    if (method === "Self") {
      order.shippingMethod = "Self";
      order.status = "Shipped";
      await order.save();
      return NextResponse.json({ success: true, message: "Assigned as Self Delivery" });
    }

    // --- NIMBUSPOST LOGIC ---
    // 1. Get Token (Usually you should cache this)
    const loginRes = await axios.post("https://api.nimbuspost.com/v1/users/login", {
      email: process.env.NIMBUS_EMAIL,
      password: process.env.NIMBUS_PASSWORD
    });
    const token = loginRes.data.data;

    // 2. Create Shipment
    const shipmentPayload = {
      order_number: order._id.toString(),
      shipping_charges: 0,
      discount: 0,
      cod_charges: 0,
      payment_type: "prepaid", // Since Razorpay was used
      order_amount: order.amount,
      package_weight: 500, // You should make this dynamic based on products
      package_length: 10,
      package_width: 10,
      package_height: 10,
      consignee: {
        name: order.shippingAddress.fullName,
        address: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode,
        phone: order.shippingAddress.phone,
      },
      pickup: {
        warehouse_name: "Primary Warehouse" // Set this in NimbusPost Dashboard
      }
    };

    const shipRes = await axios.post("https://api.nimbuspost.com/v1/shipments", shipmentPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (shipRes.data.status) {
      order.shippingMethod = "NimbusPost";
      order.awbNumber = shipRes.data.data.awb_number;
      order.shipmentId = shipRes.data.data.shipment_id;
      order.status = "Shipped";
      await order.save();
      return NextResponse.json({ success: true, data: shipRes.data.data });
    } else {
      throw new Error(shipRes.data.message || "NimbusPost Error");
    }

  } catch (error) {
    console.error("Shipping error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}