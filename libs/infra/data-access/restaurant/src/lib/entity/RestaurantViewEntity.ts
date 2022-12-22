import {ViewColumn, ViewEntity} from "typeorm";

@ViewEntity({
  materialized: true,
  name: 'order_restaurant_m_view',
  expression: `
   SELECT r.id AS restaurant_id,
    r.name AS restaurant_name,
    r.active AS restaurant_active,
    p.id AS product_id,
    p.name AS product_name,
    p.price AS product_price,
    p.available AS product_available
   FROM restaurants r,
    products p,
    restaurant_products rp
  WHERE r.id = rp.restaurant_id AND p.id = rp.product_id
    `
})
export class RestaurantViewEntity {

  @ViewColumn({name: 'restaurant_id'})
  restaurantId: string

  @ViewColumn({name: 'product_id'})
  productId: string

  @ViewColumn({name: 'restaurant_name'})
  restaurantName: string;

  @ViewColumn({name: 'restaurant_active'})
  restaurantActive: boolean;

  @ViewColumn({name: 'product_name'})
  productName: string;

  @ViewColumn({name: 'product_price'})
  productPrice: number;

  equals(o: object): boolean {
    return o instanceof RestaurantViewEntity && this.restaurantId === o.restaurantId && this.productId === o.productId
  }

}
