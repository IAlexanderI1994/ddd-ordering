import {Product, Restaurant} from "@ordering/orders/domain";
import {RestaurantEntity} from "../entity/RestaurantEntity";
import {RestaurantDataAccessException} from "../exception/RestaurantDataAccessException";
import {Money, ProductId, RestaurantId} from "@ordering/common/domain";

export class RestaurantDataAccessMapper {

  static restaurantToRestaurantProducts(restaurant: Restaurant): string[] {
    return restaurant.products.map(p => p.getId().getValue())
  }

  static restaurantEntitiesToRestaurant(restaurantEntities: RestaurantEntity[]): Restaurant {

    const [restaurantEntity] = restaurantEntities

    if ( !restaurantEntity) {
      throw new RestaurantDataAccessException("Restaurant could not be found!")
    }

    const restaurantProducts = restaurantEntities.map(
      entity => new Product(
        new ProductId(entity.productId),
        entity.productName,
        new Money(entity.productPrice)
      )

    )

    return Restaurant
      .builder()
      .setRestaurantId(new RestaurantId(restaurantEntity.restaurantId))
      .setProducts(restaurantProducts)
      .setActive(restaurantEntity.restaurantActive)
      .build()

  }
}

