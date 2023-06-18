import mongoose from "mongoose";
import { OrderDoc, OrderModel } from "../../common/src/index";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: { type: Number, required: true },
  chargeId: { type: String, require: true },
});

export const Order = mongoose.model<OrderDoc, OrderModel>("User", orderSchema);
