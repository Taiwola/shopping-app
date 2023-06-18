import { Router, Request, Response, NextFunction } from "express";
import { BadRequest, CustomError, RequireAuth } from "../common/src/index";
import { buyerService } from "./buyer.service";

const router = Router();



// routes

// get routes
router.get("/get/cart/:cartId",async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.session!.cartId;

    if(!cartId) return new BadRequest("Bad Request");

    const result = await buyerService.getCart(cartId,  req.currentUser!.userId);

    if (result instanceof CustomError || result instanceof Error) {
        return next(result);
      }
  
      res.status(200).send(result);
})

// post request/route
router.post(
  "/cart/add",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;

    const result = await buyerService.addProductToCart({
      productId,
      quantity,
      userId: req.currentUser!.userId,
    });

    if (result instanceof CustomError || result instanceof Error) {
      return next(result);
    }

    req.session = { ...req.session, cartId: result._id };

    res.status(200).send(result);
  }
);

router.post(
  "/cart/:cartId/product/:id/update-quantity",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;

    const { cartId, id: productId } = req.params;

    const inc =
      req.body.inc === "true" ? true : req.body.inc === "false" ? false : null;

    if (inc === null)
      return new BadRequest("inc should either be true of false");

    const result = await buyerService.updateCartProductQuantity({
      cartId,
      productId,
      options: { amount, inc },
    });

    if (result instanceof CustomError || result instanceof Error) {
      return next(result);
    }

    res.status(200).send(result);
  }
);

router.post(
  "/cart/delete/product",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { cartId, productId } = req.body;

    const result = await buyerService.removeProductInCart({
      cartId,
      productId,
    });

    if (result instanceof CustomError || result instanceof Error) {
      return next(result);
    }

    res.status(200).send(result);
  }
);

router.post("payment/checkout", async (req: Request, res: Response, next: NextFunction) => {
  const {cardToken} = req.body;

  const result = await buyerService.checkout(req.currentUser!.userId, cardToken, req.currentUser!.email);

  if (result instanceof CustomError) {
    return next(result);
  }

  res.status(200).send(result.id);

});

router.post("/payment/card/update", async (req: Request, res: Response, next: NextFunction)=> {
  const {cardToken} = req.body;

  const result = await buyerService.updateCustomerStripeCard(req.currentUser!.userId, cardToken);


  if (result instanceof CustomError || result instanceof Error) {
    return next(result);
  }

  res.status(200).send(result);
});

// delete route
// router.delete("")

export { router as buyerRouter };
