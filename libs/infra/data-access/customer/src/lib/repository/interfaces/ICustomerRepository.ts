import {Optional} from "@ordering/common/types";
import {Customer} from "@ordering/orders/domain";

export interface ICustomerRepository {

  findCustomer(customerId: string): Promise<Optional<Customer>>
}
