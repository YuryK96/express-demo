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

// ACTIVITIES =====>

const BASE_URL_ACTIVITIES = '/api/v1/Activities'

let activities = [{
    id: 0,
    title: 'Jumping',
    dueDate: new Date(),
    completed: true
},
    {
        id: 1,
        title: 'Jogging',
        dueDate: new Date(),
        completed: true
    },
    {
        id: 2,
        title: 'Walking',
        dueDate: new Date(),
        completed: false
    }]

app.get(BASE_URL_ACTIVITIES, (req: Request, res: Response) => {
    res.json(activities)
})

app.post(BASE_URL_ACTIVITIES, (req: Request, res: Response) => {
    // fetch('http://localhost:3000/api/v1/Activities', {method: 'POST', body: JSON.stringify({title: 'skiing', completed: false }), headers: {"content-type" : "application/json"} }).then((res)=> res.json()).then( (res)=> console.log(res) )
    if (!req.body.title) {
        res.sendStatus(statusCode.NOT_FOUND_404)
        return
    }

    const newActivity = {
        id: +new Date(),
        title: req.body.title,
        dueDate: new Date(),
        completed: req.body.completed || false
    }

    activities.push(newActivity);

    res
        .status(statusCode.CREATED_201)
        .json(newActivity)

})

app.get(`${BASE_URL_ACTIVITIES}/:id`, (req: Request, res: Response) => {

    const foundedActivity = activities.find((activity) => activity.id === +req.params.id)

    if (!foundedActivity) {
        res.sendStatus(statusCode.NOT_FOUND_404)
        return
    }

    res.json(foundedActivity)

})

app.put(`${BASE_URL_ACTIVITIES}/:id`, (req: Request, res: Response) => {
    // fetch('http://localhost:3000/api/v1/Activities/1', {method: 'PUT', body: JSON.stringify({ }), headers: {"content-type" : "application/json"} }).then((res)=> res.json()).then( (res)=> console.log(res) )

    let foundedActivity = activities.find((activity) => activity.id === +req.params.id)

    if (!foundedActivity) {
        res.sendStatus(statusCode.NOT_FOUND_404)
        return
    }
    foundedActivity = {
        ...foundedActivity,
        title: req.body.title || foundedActivity.title,
        completed: req.body.completed || foundedActivity.completed
    }

    for (let i = 0; activities.length > i; i++) {
        if (activities[i].id === foundedActivity.id) {
            activities[i] = foundedActivity;
            break
        }
    }

    res
        .status(statusCode.CREATED_201)
        .json(foundedActivity)

})

app.delete(`${BASE_URL_ACTIVITIES}/:id`, (req: Request, res: Response) => {
    // fetch('http://localhost:3000/api/v1/Activities/1', {method: 'DELETE'}).then((res)=> res.json()).then( (res)=> console.log(res) )
    const newActivities = activities.filter((activity) => activity.id !== +req.params.id)

    if (activities.length === newActivities.length) {
        res.sendStatus(statusCode.NOT_FOUND_404)
        return
    }
    activities = newActivities
    res.sendStatus(statusCode.NO_CONTENT_204)
})

//  <=======  ACTIVITIES

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});