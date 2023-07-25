import express, {Express, Request, Response} from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;


const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const statusCode = {
    NOT_FOUND_404: 404,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

};

let products = [{
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
}];

const addresses = [{
    name: 'Puschkina',
    id: 0
}, {
    name: 'Kirovo',
    id: 1
}];


app.get('/products/', (req: Request, res: Response) => {

    if (req.query.title) {
        const foundProduct = products.filter(product => product.name.indexOf(req.query.title as string) > -1);

        res.json(foundProduct);
        return;
    }

    res.json(products);
});

app.get('/products/:id', (req: Request, res: Response) => {
    const chosenProduct = products.find(item => item.id === +req.params.id);
    if (!chosenProduct) {
        res.sendStatus(statusCode.NOT_FOUND_404);
        return;
    }
    res.json(chosenProduct);
});

app.get('/products/:id', (req: Request, res: Response) => {
    const chosenProduct = products.find(item => item.id === +req.params.id);
    if (!chosenProduct) {
        res.sendStatus(statusCode.NOT_FOUND_404);
        return;
    }
    res.json(chosenProduct);

});

app.delete('/products/:id', (req: Request, res: Response) => {
    const newProducts = products.filter(item => item.id !== +req.params.id);
    if (newProducts.length === products.length) {
        res.sendStatus(statusCode.NOT_FOUND_404);
        return;
    }
    products = newProducts;
    res.sendStatus(statusCode.NO_CONTENT_204)
});

app.post('/products', (req: Request, res: Response) => {

    if (!req.body.name) {
        res.sendStatus(statusCode.NOT_FOUND_404);
        return;
    }

    const newProduct = {
        name: req.body.name,
        id: +(new Date())
    };

    products.push(newProduct);
    res.status(statusCode.CREATED_201)
        .json(newProduct);
});

app.put('/products/:id', (req: Request, res: Response) => {

    if (!req.body.name || !req.params.id) {
        res.sendStatus(statusCode.NOT_FOUND_404);
        return;
    }

    const changedProduct = products.find(product => product.id === +req.params.id ? product.name = req.body.name : null)

    res.status(statusCode.CREATED_201)
        .json(changedProduct);
});


app.get('/addresses', (req: Request, res: Response) => {
    res.json(addresses);
});
app.get('/addresses/:id', (req: Request, res: Response) => {
    const chosenAdress = addresses.find(item => item.id === +req.params.id);
    if (!chosenAdress) {
        res.sendStatus(statusCode.NOT_FOUND_404);
        return;
    }
    res.json(chosenAdress);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});