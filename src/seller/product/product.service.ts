import { ProductModel, uploadDir } from "../../common/src/index";
import { Product } from "./product.model";
import {
  CreateProductDto,
  UpdateProductDto,
  DeleteProductDto,
  AddImagesDto,
  DeleteImagesDto
} from "../../dtos/product.dto";
import fs from "fs";
import path from "path";

export class ProductService {
  constructor(public productModel: ProductModel) {}

  async getOneById(productId: string) {
    return this.productModel.findById({ _id: productId });
  }

  async create(createProduct: CreateProductDto) {
    let images = this.generateProductImages(createProduct.files);
    const product = new this.productModel({
      title: createProduct.title,
      price: createProduct.price,
      user: createProduct.userId,
      images: images,
    });

    return await product.save();
  }

  generateBase64Url(contentType: string, buffer: Buffer) {
    return `data.${contentType};base64,${buffer.toString("base64")}`;
  }

  async updateProduct(updateProduct: UpdateProductDto) {
    return await this.productModel.findOneAndUpdate(
      { _id: updateProduct.productId },
      {
        $set: { title: updateProduct.title, price: updateProduct.price },
      },
      { new: true }
    );
  }

  async deleteProductById(deleteProduct: DeleteProductDto) {
    return await this.productModel.findOneAndRemove({
      _id: deleteProduct.productId,
    });
  }

  async addImages(addImages: AddImagesDto) {
    let images = this.generateProductImages(addImages.files);
    return await this.productModel.findOneAndUpdate(
      {_id: addImages.productId},
      {$push: {images: {$each : images}}},
      {new: true}
      )
  }

  async deleteImages(deleteImage: DeleteImagesDto){
    const images = await this.productModel.findOneAndUpdate(
      {_id: deleteImage.productId},
      {$pull: {images: {_id: {$in: deleteImage.imageIds}}}},
      {new: true}
      );

      return images;
  
  }

  generateProductImages(
    files: CreateProductDto["files"]
  ): Array<{ src: string }> {
    let images: Array<Express.Multer.File>;

    if (typeof files === "object") {
      images = Object.values(false).flat();
    } else {
      images = files ? [...files] : [];
    }

    return images.map((file: Express.Multer.File) => {
      let srcObj = {
        src: this.generateBase64Url(
          file.mimetype,
          fs.readFileSync(path.join(uploadDir + file.filename))
        ),
      };

      fs.unlink(path.join(uploadDir + file.filename), () => {});

      return srcObj;
    });
  }
}

export const productService = new ProductService(Product);
