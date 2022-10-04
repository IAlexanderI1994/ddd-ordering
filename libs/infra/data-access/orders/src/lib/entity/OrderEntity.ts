import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {OrderStatus} from "@ordering/common/domain";
import {OrderAddressEntity} from "./OrderAddressEntity";
import {OrderItemEntity} from "./OrderItemEntity";

@Entity({
  name: 'orders'
})
export class OrderEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  customerId: string;

  @Column("uuid")
  restaurantId: string;

  @Column("uuid")
  trackingId: string;

  @Column("decimal")
  price: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
  })
  orderStatus: OrderStatus

  @Column("varchar")
  failureMessages: string

  @OneToOne(() => OrderAddressEntity, {cascade: true})
  @JoinColumn()
  address: OrderAddressEntity

  @OneToMany(() => OrderItemEntity, orderItem => orderItem)
  @JoinColumn()
  orderItems: OrderItemEntity[]


  equals(o: object): boolean {
    return o instanceof OrderEntity && o.id === this.id
  }


}
