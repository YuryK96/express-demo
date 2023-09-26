import express, {Express} from "express";
import {getProductsRouter} from "./routes/products";
import {getAddressesRouter} from "./routes/addresses";
import {BASE_URL_ACTIVITIES, getActivitiesRouter} from "./routes/activities";
import {activities} from "./db/db-activities";
import {addresses} from "./db/db-addresses";

export const app: Express = express();
export const jsonBodyMiddleware = express.json();


app.use(jsonBodyMiddleware);

app.use('/products/', getProductsRouter())
app.use('/addresses', getAddressesRouter(addresses))
app.use(BASE_URL_ACTIVITIES, getActivitiesRouter(activities))