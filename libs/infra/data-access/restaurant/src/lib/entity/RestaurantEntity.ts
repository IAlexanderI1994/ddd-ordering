import {Column, PrimaryColumn, ViewEntity} from "typeorm";

//@todo: тут используется id class в курсе
@ViewEntity({
  materialized: true,
  name: 'order_restaurant_m_view',
  schema: 'restaurants'
})
export class RestaurantEntity {

  @PrimaryColumn()
  restaurantId: string

  @PrimaryColumn()
  productId: string

  @Column('varchar')
  restaurantName: string;

  @Column('boolean')
  restaurantActive: boolean;

  @Column('varchar')
  productName: string;

  @Column('decimal')
  productPrice: number;

  equals(o: object): boolean {
    return o instanceof RestaurantEntity && this.restaurantId === o.restaurantId && this.productId === o.productId
  }

}
