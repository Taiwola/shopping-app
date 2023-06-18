import { Router, Request, Response, NextFunction } from "express";
import {
  BadRequest,
  Uploader,
  UploaderOptions,
  RequireAuth,
  uploadDir,
  CustomError,
} from "../common/src/index";
import { sellerService } from "./seller.service";

const uploader = new Uploader(uploadDir);
const middlewareOptions = {
  types: ["image/png", "image/jpg", "image/jpeg"],
  fieldName: "image",
};
const multipleFiles = uploader.uploadMultipleFiles(middlewareOptions);

const router = Router();

router.post(
  "/product/new",
  RequireAuth,
  multipleFiles,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    if (!req.files) return next(new BadRequest("image are required"));
    if (req.uploaderError)
      return next(new BadRequest(req.uploaderError.message));

    let product = await sellerService.addProduct({
      title,
      price,
      userId: req.currentUser!.userId,
      files: req.files,
    });

    res.status(200).send(product);
  }
);

// patch router
router.patch(
  "/product/:id/update",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const result = await sellerService.updateProduct({
      title,
      price,
      userId: req.currentUser!.userId,
      productId: id,
    });

    if (result instanceof CustomError) {
      return next(result);
    }

    res.status(200).send(result);
  }
);

router.patch("product/:id/add-images", RequireAuth, multipleFiles,async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  if (!req.files) return next(new BadRequest("image are required"));
  if (req.uploaderError)
    return next(new BadRequest(req.uploaderError.message));
  const result = await sellerService.addProductImages({
    productId: id,
    userId: req.currentUser!.userId,
    files: req.files
  });

  if(result instanceof CustomError) {
    return next(result);
  }


  res.status(200).json({data: result})
})

// delete router
router.delete("/product/:id/delete", RequireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  const result = await sellerService.deleteProduct({
   productId: id,
   userId: req.currentUser!.userId
  });

  if(result instanceof CustomError) return next(result);

  res.status(200).send(true);

});

router.delete("/product/:id/delete-image", RequireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  const {images} = req.body
  const result = await sellerService.deleteImages({
    productId: id,
    userId: req.currentUser!.userId,
    imageIds: images
  });

  if(result instanceof CustomError) {
    return next(result);
  }

  res.status(200).json({message: "image deleted", success: true});

})


export {router as sellerRouter}