import mongoose, { mongo } from "mongoose";
import {UserDoc} from "../auth/user.interfaces";
import {CartProductDoc} from "./cart-product.interfaces"


export interface CartDoc extends mongoose.Document {
    user: UserDoc,
    products: Array<CartProductDoc | string>,
    totalPrice: number,
    customerId?: string
};

export interface CartModel extends mongoose.Model<CartDoc>{}