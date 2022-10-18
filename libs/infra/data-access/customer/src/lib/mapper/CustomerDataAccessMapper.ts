import {CustomerEntity} from "../entity/CustomerEntity";
import {Customer} from "@ordering/orders/domain";
import {CustomerId} from "@ordering/common/domain";

export class CustomerDataAccessMapper {

  static customerEntityToCustomer(customerEntity: CustomerEntity): Customer {

    return new Customer(new CustomerId(customerEntity.id))
  }
}
