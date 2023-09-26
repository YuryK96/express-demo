import {ProductsViewModel} from "../models/products/productsViewModel";


export let products: ProductsViewModel[] = [{
    name: 'T-shirt',
    id: 0
}, {
    name: 'shirt',
    id: 1
}, {
    name: 'jeans',
    id: 2
}, {
    name: 'gloves',
    id: 3
}, {
    name: 'sweater',
    id: 4

},];

export const  replaceAllProducts = (newProducts: ProductsViewModel[])=> {
    products = newProducts
}
export const  clearAllProducts = ()=> {
    products = []
}

export const getProducts = ()=> products