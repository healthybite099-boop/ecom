import mongoose, { Schema } from "mongoose";

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "DryFruitProduct2", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    userId: { type: String, required: true }, // can be logged-in user id or guest id stored in localStorage
    items: [CartItemSchema],
  },
  { timestamps: true }
);

CartSchema.index({ userId: 1 }, { unique: true });

const CartModel = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default CartModel;
