import { ProductService, productService } from "./product/product.service";
import { CreateProductDto, UpdateProductDto, DeleteProductDto, AddImagesDto, DeleteImagesDto } from "../dtos/product.dto";
import { BadRequest, NotAuthorized } from "../common/src/index";
export class SellerService {
  constructor(public productService: ProductService) {}

  async addProduct(createProduct: CreateProductDto) {
    return await this.productService.create(createProduct);
  }

  async updateProduct(updateProduct: UpdateProductDto) {
    const product = await this.productService.getOneById(
      updateProduct.productId
    );

    if (!product) return new BadRequest("product not found");

    if (product.user.toString() !== updateProduct.userId) {
      return new NotAuthorized("not authorized");
    }

    return await this.productService.updateProduct(updateProduct);
  }

  async deleteProduct(deleteProduct: DeleteProductDto) {
    const product = await this.productService.getOneById(
        deleteProduct.productId
      );

    if (!product) return new BadRequest("product not found");

    if (product.user.toString() !== deleteProduct.userId) {
      return new NotAuthorized("not authorized");
    }

    return await this.productService.deleteProductById(deleteProduct);

  }

  async addProductImages(addImages: AddImagesDto) {
    const product = await this.productService.getOneById(addImages.productId);
    if (!product) return new BadRequest("product not found");

    if(product.user.toString() !== addImages.userId) {
        return new NotAuthorized("not authorized");
    }

    return await this.productService.addImages(addImages);
  }

  async deleteImages(deleteImage: DeleteImagesDto) {
    const product = await this.productService.getOneById(deleteImage.productId);
    if(!product) return new BadRequest("product not found");

    if(product.user.toString() !== deleteImage.userId) {
        return new NotAuthorized("not authorized");
    }

    return await this.productService.deleteImages(deleteImage);
  }

  
}

export const sellerService = new SellerService(productService);
