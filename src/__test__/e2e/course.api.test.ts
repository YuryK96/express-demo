import axios, {AxiosResponse} from 'axios';
import {ProductsViewModel} from "../../models/products/productsViewModel";
import {CreateProductsModel} from "../../models/products/createProductsModel";
//
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

const BASE_URL = "http://localhost:3000/"

describe('api product tests', () => {

    beforeAll(async () => {
        await axios.delete(`${BASE_URL}products/`)
    })


    it('should return 200 and product array', async () => {
        const result: AxiosResponse<ProductsViewModel[]> = await axios.get(`${BASE_URL}products/`);
        expect({products: result.data, status: result.status}).toStrictEqual({products: [], status: 200});
    });
    it('should return 404 for not existing product', async () => {
        const result:number = await axios.get(`${BASE_URL}products/9999`).catch((res) => res.response.status)
        expect(result).toBe(404)
    })
    it('should return 204 empty product array', async () => {

        const result = await axios.delete(`${BASE_URL}products`)
        expect(result.status).toBe(204)
    })
    it("shouldn't create new product and return 404", async () => {
        const result:number = await axios.post(`${BASE_URL}products`, {}).catch((res) => res.response.status)
        expect(result).toBe(404)

        const product: AxiosResponse<ProductsViewModel[]> = await axios.get(`${BASE_URL}products/`);
        expect({products: product.data, status: product.status}).toStrictEqual({products: [], status: 200});
    })

    let newProduct: ProductsViewModel | null = null;
    it("should create new product and return 201", async () => {
        const data: CreateProductsModel = {name: 'newProduct'};
        newProduct = await axios.post(`${BASE_URL}products`, data).then((res) => res.data)
        expect({name: newProduct?.name, id: newProduct?.id}).toEqual({
            name: 'newProduct',
            id: expect.any(Number),
        })
        const products: AxiosResponse<ProductsViewModel[]> = await axios.get(`${BASE_URL}products/`);
        expect({products: products.data, status: products.status}).toStrictEqual({
            products: [newProduct],
            status: 200
        });


    })
    it("shouldn't change product name", async () => {

        const data: CreateProductsModel = {name: ''};
        const result = await axios.put(`${BASE_URL}products/${newProduct?.id}`, data).catch(res => res.response.status)

        expect(result).toBe(404)

        const chosenProduct: AxiosResponse<ProductsViewModel> = await axios.get(`${BASE_URL}products/${newProduct?.id}`).then(res => res.data)

        expect(chosenProduct).toStrictEqual(newProduct)
    })
    it("shouldn change product name", async () => {

        const data: CreateProductsModel = {name: 'changedName'};
        const result = await axios.put(`${BASE_URL}products/${newProduct?.id}`, data).then(res => res.status)

        expect(result).toBe(201)

        const chosenProduct: ProductsViewModel = await axios.get(`${BASE_URL}products/${newProduct?.id}`).then(res => res.data)

        expect(chosenProduct).toStrictEqual({...newProduct, name: 'changedName'})

    })

    it("should create new product and return 201", async () => {
        const data: CreateProductsModel = {name: 'newProduct2'};
        const newProduct2: ProductsViewModel = await axios.post(`${BASE_URL}products`, data).then((res) => res.data)
        expect({name: newProduct2.name, id: newProduct2.id}).toEqual({
            name: 'newProduct2',
            id: expect.any(Number),
        })
        const products: AxiosResponse<ProductsViewModel[]> = await axios.get(`${BASE_URL}products/`);
        expect({products: products.data, status: products.status}).toStrictEqual({
            products: [{...newProduct, name: "changedName"}, newProduct2],
            status: 200
        });

    })

    it("should delete all products", async () => {
        await axios.delete(`${BASE_URL}products/`)

        const result: AxiosResponse<ProductsViewModel> = await axios.get(`${BASE_URL}products/`);
        expect({products: result.data, status: result.status}).toStrictEqual({products: [], status: 200});
    })
});