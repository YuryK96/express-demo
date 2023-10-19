import {products, replaceAllProducts} from "../db/db-products";
import {ProductsViewModel} from "../models/products/productsViewModel";

export const productsRepository = {
    getProducts(): ProductsViewModel[] {
        return products
    },
    foundedProduct(id: number): ProductsViewModel | undefined {
        return products.find(item => item.id === id);
    },
    deleteByIdProduct(id: number): ProductsViewModel[] | undefined {
        const newProducts = products.filter(item => item.id !== id);

        if (newProducts.length === products.length) {
            return undefined
        }
        replaceAllProducts(newProducts)
        return newProducts
    },
    addProduct(name: string) {
        const newProduct = {
            name,
            id: +(new Date())
        };
        products.push(newProduct);
        return newProduct
    },
    changeProduct(id: number, name: string): ProductsViewModel | undefined {
        let foundedProduct: ProductsViewModel | undefined = this.foundedProduct(id)
        if (foundedProduct) {
            foundedProduct.name = name
            return foundedProduct
        }
        return undefined
    },
    deleteAllProducts() {
        products.length = 0
    }
}