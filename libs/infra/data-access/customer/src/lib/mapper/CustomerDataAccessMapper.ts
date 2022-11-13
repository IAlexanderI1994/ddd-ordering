import {CustomerEntity} from "../entity/CustomerEntity";
import {Customer} from "@delivery/orders/domain";
import {CustomerId} from "@delivery/common/domain";

export class CustomerDataAccessMapper {

  static customerEntityToCustomer(customerEntity: CustomerEntity): Customer {

    return new Customer(new CustomerId(customerEntity.id))
  }
}
