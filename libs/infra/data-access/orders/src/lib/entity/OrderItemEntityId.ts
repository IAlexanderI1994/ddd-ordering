import {OrderEntity} from "./OrderEntity";
import * as hash from 'object-hash'


export class OrderItemEntityId {



  constructor(
    readonly id: number,
    readonly orderEntity: OrderEntity
  ) {
  }



  equals(o: object): boolean {
    return o instanceof OrderItemEntityId && o.id === this.id && o.orderEntity.equals( this.orderEntity)
  }


  hashCode() {
    return hash(this.id)
  }

}
