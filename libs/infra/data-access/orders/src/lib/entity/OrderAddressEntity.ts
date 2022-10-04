import {Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {OrderEntity} from "./OrderEntity";
import * as hash from 'object-hash'

@Entity({
  name: 'order_address'
})
export class OrderAddressEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => OrderEntity, {cascade: true})
  @JoinColumn({name: "order_id"})
  order: OrderEntity;

  @Column()
  street: string;

  @Column()
  postalCode: string;

  @Column()
  city: string;


  setOrder(order: OrderEntity) {

    this.order = order
  }

  equals(o: object): boolean {
    return o instanceof OrderAddressEntity && o.id === this.id || this === o
  }

  hashCode() {
    return hash(this.id)
  }


}
