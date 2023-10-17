import {ProductsViewModel} from "../models/products/productsViewModel";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types";
import {ProductsQueryModel} from "../models/products/queryProductsModel";
import express, {Request, Response} from "express";
import {UriParamsProductsModel} from "../models/products/uriParamsProductsModel";
import {CreateProductsModel} from "../models/products/createProductsModel";
import {UpdateProductsModel} from "../models/products/updateProductsModel";
import {statusCode} from "../statuses/statuses";
import {productsRepository} from "../repositories/products-repository";


export const getProductsViewModel = (product: ProductsViewModel) => {
    return {id: product.id, name: product.name}

}

export const getProductsRouter = () => {
    const router = express.Router()

    router.get('', (req: RequestWithParams<ProductsQueryModel>, res: Response<ProductsViewModel[] | ProductsViewModel>) => {
        const products = productsRepository.getProducts()
        res.json(products.map(product => getProductsViewModel(product)));
    });

    router.get('/:id', (req: Request<UriParamsProductsModel>, res: Response<ProductsViewModel>) => {
        const foundedProduct = productsRepository.foundedProduct(+req.params.id)
        if (!foundedProduct) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;
        }
        res.json(getProductsViewModel(foundedProduct));
    });

    router.delete('/:id', (req: Request<UriParamsProductsModel>, res: Response) => {
        const newProducts = productsRepository.deleteByIdProduct(+req.params.id)
        if (!newProducts) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;
        }
        res.sendStatus(statusCode.NO_CONTENT_204)
    });

    router.post('/', (req: RequestWithBody<CreateProductsModel>, res: Response<ProductsViewModel>) => {

        if (!req.body.name) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;
        }

        const newProduct = productsRepository.addProduct(req.body.name)

        res.status(statusCode.CREATED_201)
            .json(getProductsViewModel(newProduct));
    });

    router.put('/:id', (req: RequestWithParamsAndBody<UriParamsProductsModel, UpdateProductsModel>, res: Response<ProductsViewModel>) => {

        if (!req.body.name || !req.params.id) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;
        }

        const changedProduct = productsRepository.changeProduct(+req.params.id, req.body.name)

        if (!changedProduct) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return;
        }
        res.status(statusCode.CREATED_201)
            .json(getProductsViewModel(changedProduct));
    });


    router.delete('/', (req: Request, res: Response) => {
        productsRepository.deleteAllProducts()
        res.sendStatus(statusCode.NO_CONTENT_204)
    })
    return router
}