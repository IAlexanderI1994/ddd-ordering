import {Optional} from "@delivery/common/types";
import {Customer} from "@delivery/orders/domain";

export interface ICustomerRepository {

  findCustomer(customerId: string): Promise<Optional<Customer>>
}
