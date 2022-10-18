import {AggregateRoot, CustomerId} from "@ordering/common/domain";

export class Customer extends AggregateRoot<CustomerId> {

    constructor(customerId: CustomerId) {
        super()
        super.setId(customerId)
    }

}
