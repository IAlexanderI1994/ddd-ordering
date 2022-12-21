import {CustomerEntityView} from "../entity/CustomerEntityView";
import {Customer} from "@delivery/orders/domain";
import {CustomerId} from "@delivery/common/domain";

export class CustomerDataAccessMapper {

  static customerEntityToCustomer(customerEntity: CustomerEntityView): Customer {

    return new Customer(new CustomerId(customerEntity.customerId))
  }
}
