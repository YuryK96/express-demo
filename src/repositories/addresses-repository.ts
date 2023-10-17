import {addresses} from "../db/db-addresses";
import {AddressesViewModel} from "../models/adresses/addressesViewModel";

export const addressesRepository = {
    getAddresses(): AddressesViewModel[] {
        return addresses
    },
    findAddress(id: number): AddressesViewModel | undefined {
        return addresses.find(item => item.id === id);
    }

}