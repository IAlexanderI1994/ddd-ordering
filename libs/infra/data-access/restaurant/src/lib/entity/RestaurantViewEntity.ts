import {ViewColumn, ViewEntity} from "typeorm";

@ViewEntity({
  materialized: true,
  name: 'order_restaurant_m_view',
  expression: `
   SELECT r.id AS restaurantId,
    r.name AS restaurantName,
    r.active AS restaurantActive,
    p.id AS productId,
    p.name AS productName,
    p.price AS productPrice,
    p.available AS productAvailable
   FROM restaurants r,
    products p,
    restaurant_products rp
  WHERE r.id = rp.restaurant_id AND p.id = rp.product_id
    `
})
export class RestaurantViewEntity {

  @ViewColumn()
  restaurantId: string

  @ViewColumn()
  productId: string

  @ViewColumn()
  restaurantName: string;

  @ViewColumn()
  restaurantActive: boolean;

  @ViewColumn()
  productName: string;

  @ViewColumn()
  productPrice: number;

  equals(o: object): boolean {
    return o instanceof RestaurantViewEntity && this.restaurantId === o.restaurantId && this.productId === o.productId
  }

}
