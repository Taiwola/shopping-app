export interface AddProductDto {
    userId: string,
    quantity: number,
    productId: string
}

export interface CreateCartProductDto{
    cartId: string,
    quantity: number;
    productId: string
}

export interface RemoveProductFromCartDto {
    cartId: string,
    productId: string
}

export interface UpdateCartProductDto {
    cartId: string,
    productId: string,
    options: {inc: boolean, amount: number}
}