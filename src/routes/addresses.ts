import {AddressesViewModel} from "../models/adresses/addressesViewModel";
import express, {Request, Response} from "express";
import {UriParamsAddressesModel} from "../models/adresses/uriParamsAddressesModel";
import {statusCode} from "../statuses/statuses";


export const getAddressesViewModel = (address: AddressesViewModel) => {
    return {id: address.id, name: address.name}

}

export const getAddressesRouter = (addresses: AddressesViewModel[])=> {
    const router = express.Router()
    router.get('', (req: Request, res: Response<AddressesViewModel[]>) => {
        res.json(addresses.map(address => getAddressesViewModel(address)));
    });
    router.get('/:id', (req: Request<UriParamsAddressesModel>, res: Response<AddressesViewModel>) => {
        const chosenAddress = addresses.find(item => item.id === +req.params.id);
        if (!chosenAddress) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;


        }
        res.json({name: chosenAddress.name, id: chosenAddress.id});
    });

    return router
}