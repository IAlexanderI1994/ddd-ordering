import {IDomainEvent} from "@ordering/common/domain";
import {Order} from "../entity/order";

export abstract class OrderEvent implements IDomainEvent<Order>{
  get order(): Order {
    return this._order;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  constructor(
    private readonly _order: Order,
    private readonly _createdAt: string
  ) {
  }


}
