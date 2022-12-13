import {Entity,  PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity({
  name: 'restaurant_products'
})
export class RestaurantProductsEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @PrimaryColumn("uuid", {name: 'product_id'})
  productId: string;

  @PrimaryColumn("uuid", {name: 'restaurant_id'})
  restaurantId: string;

}
