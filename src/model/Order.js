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
    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Cancelled"],
      default: "Paid",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true }
);

const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default OrderModel;
