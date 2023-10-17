import {AddressesViewModel} from "../models/adresses/addressesViewModel";
import express, {Request, Response} from "express";
import {UriParamsAddressesModel} from "../models/adresses/uriParamsAddressesModel";
import {statusCode} from "../statuses/statuses";
import {addressesRepository} from "../repositories/addresses-repository";


export const getAddressesViewModel = (address: AddressesViewModel) => {
    return {id: address.id, name: address.name}

}

export const getAddressesRouter = () => {
    const router = express.Router()
    router.get('', (req: Request, res: Response<AddressesViewModel[]>) => {
        const addresses = addressesRepository.getAddresses()
        res.json(addresses.map(address => getAddressesViewModel(address)));
    });
    router.get('/:id', (req: Request<UriParamsAddressesModel>, res: Response<AddressesViewModel>) => {
        const chosenAddress = addressesRepository.findAddress(+req.params.id)
        if (!chosenAddress) {
            res.sendStatus(statusCode.NOT_FOUND_404);
            return;


        }
        res.json(getAddressesViewModel(chosenAddress));
    });

    return router
}