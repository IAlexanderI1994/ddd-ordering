import {Column, Entity, Index, ManyToOne, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {OrderEntity} from "./OrderEntity";
import * as hash from 'object-hash'
import {OrderItemEntityId} from "./OrderItemEntityId";

@Entity({
  name: 'order_items'
})
export class OrderItemEntity {
  get id(): OrderItemEntityId {
    return new OrderItemEntityId(this._id, this.order);
  }


  @PrimaryGeneratedColumn({name: 'id'})
  private _id: number;

  @Index()
  @ManyToOne(() => OrderEntity, {cascade: true})
  @JoinColumn({name: "order_id"})
  order: OrderEntity;


  @Column('uuid')
  productId: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @Column('decimal')
  subTotal: number;


  setOrder(order: OrderEntity) {
    this.order = order
  }

  equals(o: object): boolean {
    return o instanceof OrderItemEntity && this.id.equals(o.id)
  }

  hashCode() {
    return hash({id: this.id, order: this.order})
  }


}
