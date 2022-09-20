import { Customer} from "@ordering/orders/domain";
import {ICustomerRepository} from "./interfaces/ICustomerRepository";

export class CustomerRepository implements ICustomerRepository {
    findCustomer(customerId: string): Customer {
        throw new Error("Method not implemented.");
    }

}
