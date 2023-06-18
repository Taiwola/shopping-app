import mongoose from "mongoose";
import { UserDoc } from "../auth/user.interfaces";

export interface OrderDoc extends mongoose.Document {
  userId: UserDoc;
  totalAmount: number;
  chargeId: string | number;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {}
