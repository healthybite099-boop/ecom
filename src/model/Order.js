import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "DryFruitProduct2", required: true },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    items: [OrderItemSchema],
    amount: { type: Number, required: true },
    // --- Added Shipping Address Schema ---
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Cancelled"],
      default: "Paid",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    shippingMethod: {
      type: String,
      enum: ["Self", "NimbusPost", "None"],
      default: "None"
    },
    awbNumber: { type: String, default: "" },
    shipmentId: { type: String, default: "" },
  },
  { timestamps: true }
);

const OrderModel = mongoose.models.Order2 || mongoose.model("Order2", OrderSchema);

export default OrderModel;