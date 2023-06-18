import {
  CartModel,
  CartProductModel,
  ProductDoc,
} from "../../common/src/index";
import {} from "../../common/src/constants/buyer/cart-product.interfaces";
import { Cart } from "./cart.model";
import { CartProduct } from "./cart-product.model";
import { AddProductDto, CreateCartProductDto, RemoveProductFromCartDto } from "../dto/cart.dto";

export class CartService {
  constructor(
    public cartModel: CartModel,
    public cartProductModel: CartProductModel
  ) {}

  async findOneByUserId(userId: string) {
    return await this.cartModel.findOne({ user: userId });
  }

  async getCartProductById(productId: string, cartId: string){
    return await this.cartProductModel.findOne({product: productId, cart: cartId});
  }

  async createCart(userId: string) {
    const cart = new this.cartModel({
      user: userId,
    });

    return await cart.save();
  }

  async createCartProduct(createCartProduct: CreateCartProductDto) {
    const { quantity, productId, cartId } = createCartProduct;

    const cartProduct = new this.cartProductModel({
      cart: cartId,
      product: productId,
      quantity,
    });

    return await cartProduct.save();
  }

  async isProductInCart(cartId: string, productId: string) {
    return !!(await this.cartProductModel.findOne({
      cart: cartId,
      product: productId,
    }));
  };

  async removeProductFromCart(removeProduct: RemoveProductFromCartDto) {
    const {cartId, productId} = removeProduct;

    const cartProduct = await this.cartProductModel.findOne({product: productId}).populate('product');

    if(!cartProduct) {
        return null;
    }
    const deleteDoc = await this.cartProductModel.findOneAndRemove({_id: cartProduct._id});

    if(!deleteDoc) return null;

    return await this.cartModel.findOneAndUpdate({_id: cartId},
        {$pull: {products: cartProduct._id}, $inc:{totalPrice: -(cartProduct.product.price * cartProduct.quantity)}},
        {new: true})
  }

  async updateProductQuantity(
    cartId: string,
    productId: string,
    options: { inc: boolean; amount: number }
  ) {
    const { inc, amount } = options;
    const cartProduct = await this.cartProductModel.findOne({
      product: productId,
    });

    if (!cartProduct) {
      return null;
    }

    if (cartProduct.quantity < amount && !inc) {
      // remove product
      return await this.removeProductFromCart({cartId, productId})
    }

    const updatedCartProduct = await this.cartProductModel
      .findOneAndUpdate(
        { _id: cartProduct._id },
        { $inc: { quantity: inc ? amount : -amount } },
        { new: true }
      )
      .populate("product");

    const newPrice = inc
      ? updatedCartProduct!.product!.price * amount
      : -(updatedCartProduct!.product!.price * amount);

    const updatedCart = await this.cartModel.findOneAndUpdate(
      { _id: cartId },
      { $inc: { totalPrice: newPrice } },
      { new: true }
    );

    return updatedCart;
  }

  async addProduct(addProduct: AddProductDto, product: ProductDoc) {
    const { userId, productId, quantity } = addProduct;

    let cart = await this.findOneByUserId(userId);

    let cartId = cart?._id;

    const isProduct = cart && (await this.isProductInCart(cartId, productId));

    if (isProduct && cart) {
        return this.updateProductQuantity(cartId, productId, {inc: true, amount: quantity})
    }

    if (!cart) {
      cart = await this.createCart(userId);
    }

    const cartProduct = await this.createCartProduct({
      cartId: cart._id,
      quantity,
      productId,
    });

    return await this.cartModel.findOneAndUpdate(
      { _id: cart._id },
      {
        $push: { products: cartProduct },
        $inc: { totalPrice: product.price * quantity },
      },
      { new: true }
    );
  }

  async getCart (cartId: string) {
    return await this.cartModel.findOne({_id: cartId});
  }

  async clearCart(userId: string, cartId: string) {
    return await this.cartModel.findOneAndUpdate({_id: cartId, user: userId}, 
      {$set: {products: [], totalPrice:0}}, {new: true});
  }
}

export const cartService = new CartService(Cart, CartProduct);
