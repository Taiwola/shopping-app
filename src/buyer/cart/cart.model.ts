import mongoose from "mongoose";
import {
  CartDoc,
  CartModel,
} from "../../common/src/constants/buyer/cart.interface";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartProduct",
    },
  ],
  totalPrice: { type: Number, required: true, default: 0 },
  customerId: { type: String },
});

export const Cart = mongoose.model<CartDoc, CartModel>("Cart", cartSchema);
