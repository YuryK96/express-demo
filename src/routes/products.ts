import {ProductsViewModel} from "../models/products/productsViewModel";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types";
import {ProductsQueryModel} from "../models/products/queryProductsModel";
import express, {Request, Response} from "express";
import {UriParamsProductsModel} from "../models/products/uriParamsProductsModel";
import {CreateProductsModel} from "../models/products/createProductsModel";
import {UpdateProductsModel} from "../models/products/updateProductsModel";
import {statusCode} from "../statuses/statuses";
import {clearAllProducts, getProducts, replaceAllProducts} from "../db/db-products";


export const getProductsViewModel = (product: ProductsViewModel) => {
    return {id: product.id, name: product.name}

}

export const getProductsRouter = () => {
    const router = express.Router()

    router.get('', (req: RequestWithParams<ProductsQueryModel>, res: Response<ProductsViewModel[] | ProductsViewModel>) => {

        if (req.query.title) {
            const foundProduct = getProducts().filter(product => product.name.indexOf(req.query.title) > -1);

            res.json(foundProduct);
            return;
        }
        res.json(getProducts().map(product => getProductsViewModel(product)));
    });

    router.get('/:id', (req: Request<UriParamsProductsModel>, res: Response<ProductsViewModel>) => {
        const chosenProduct = getProducts().find(item => item.id === +req.params.id);
        if (!chosenProduct) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;
        }
        res.json({id: chosenProduct.id, name: chosenProduct.name});
    });

    router.delete('/:id', (req: Request<UriParamsProductsModel>, res: Response) => {
        const newProducts = getProducts().filter(item => item.id !== +req.params.id);
        if (newProducts.length === getProducts().length) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;
        }
        replaceAllProducts(newProducts)
        res.sendStatus(statusCode.NO_CONTENT_204)
    });

    router.post('/', (req: RequestWithBody<CreateProductsModel>, res: Response<ProductsViewModel>) => {

        if (!req.body.name) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;
        }

        const newProduct = {
            name: req.body.name,
            id: +(new Date())
        };
        getProducts().push(newProduct);
        res.status(statusCode.CREATED_201)
            .json({id: newProduct.id, name: newProduct.name});
    });

    router.put('/:id', (req: RequestWithParamsAndBody<UriParamsProductsModel, UpdateProductsModel>, res: Response<ProductsViewModel>) => {

        if (!req.body.name || !req.params.id) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;
        }

        const changedProduct = getProducts().find(product => product.id === +req.params.id ? product.name = req.body.name : null)

        if (!changedProduct) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return;
        }
        res.status(statusCode.CREATED_201)
            .json({id: changedProduct.id, name: changedProduct.name});
    });


    router.delete('/', (req: Request, res: Response) => {
        clearAllProducts()
        res.sendStatus(statusCode.NO_CONTENT_204)
    })
    return router
}