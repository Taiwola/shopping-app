import {
  productService,
  ProductService,
} from "../seller/product/product.service";
import { cartService, CartService } from "./cart/cart.service";
import {
  AddProductDto,
  UpdateCartProductDto,
  RemoveProductFromCartDto,
} from "./dto/cart.dto";
import { BadRequest, NotAuthorized } from "../common/src/index";
import Stripe from "stripe";
import { OrderService, orderService } from "./order/order.service";

export class BuyerService {
  constructor(
    public cartService: CartService,
    public productService: ProductService,
    public orderService: OrderService,
    public stripeService: Stripe
  ) {}

  async addProductToCart(addProduct: AddProductDto) {
    const { userId, productId, quantity } = addProduct;
    const product = await this.productService.getOneById(productId);

    if (!product) return new BadRequest("product not found");

    const cart = await this.cartService.addProduct(addProduct, product);

    if (!cart) return new Error("cart could not be updated");

    return cart;
  }

  async updateCartProductQuantity(updateProductQuantity: UpdateCartProductDto) {
    const { cartId, productId, options } = updateProductQuantity;

    const cartProduct = await this.cartService.getCartProductById(
      productId,
      cartId
    );

    if (!cartProduct) {
      return new BadRequest("Not Found");
    }

    const cart = await this.cartService.updateProductQuantity(
      cartId,
      productId,
      options
    );

    if (!cart) return new Error("could not update the cart");

    return cart;
  }

  async removeProductInCart(removeProductInCart: RemoveProductFromCartDto) {
    const { cartId, productId } = removeProductInCart;

    const cartProduct = await this.cartService.getCartProductById(
      cartId,
      productId
    );

    if (!cartProduct) return new BadRequest("Product not found");

    const cart = await this.cartService.removeProductFromCart(
      removeProductInCart
    );

    if (!cart) return new Error("could not update the cart");

    return cart;
  }

  async getCart(cartId: string, userId: string) {
    const cart = await this.cartService.getCart(cartId);

    if (!cart) return new BadRequest("cart not found");

    if (cart.user.toString() !== userId) {
      return new NotAuthorized("not authorized");
    }

    return cart;
  }

  async checkout(userId: string, cardToken: string, userEmail: string) {
    const cart = await this.cartService.findOneByUserId(userId);

    if (!cart) {
      return new BadRequest("cart is empty");
    }

    if (cart.products.length === 0) {
      return new BadRequest("cart is empty");
    }

    let customerId: string;

    if (cart.customerId) {
      customerId = cart.customerId;
    } else {
      const { id } = await this.stripeService.customers.create({
        email: userEmail,
        source: cardToken,
      });
      customerId = id;
      await cart.set({ customerId }).save();
    }

    if (!customerId) return new BadRequest("Invalid credential");

    const charge = await this.stripeService.charges.create({
      amount: cart.totalPrice * 100,
      currency: "USD",
      customer: customerId,
    });

    if (!charge) return new BadRequest("Invalid data");

    // create new order
    await this.orderService.createOrder({
      userId,
      totalAmount: cart.totalPrice,
      chargeId: charge.id
    });

    // clear the cart
    const cartId = cart._id;
    await this.cartService.clearCart(userId, cartId);

    // return the charge
    return charge;
  }

  async updateCustomerStripeCard (userId: string, newCardToken: string) {
      const cart = await this.cartService.findOneByUserId(userId);
      if(!cart) return new BadRequest("your cart is empty");

      if(!cart.customerId) return new BadRequest("not a customer");

      
      try {
        await this.stripeService.customers.update(cart.customerId, {
          source: newCardToken
        });
      } catch (error) {
        console.log(error);
        return new Error("card update failed");
      }

      return true
  }
}

export const buyerService = new BuyerService(
  cartService,
  productService,
  orderService,
  new Stripe(process.env.STRIPE_KEY!, { apiVersion: "2022-11-15" })
);
