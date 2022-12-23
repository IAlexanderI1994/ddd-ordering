import {Product, Restaurant} from "@delivery/orders/domain";
import {RestaurantDataAccessException} from "../exception/RestaurantDataAccessException";
import {Money, ProductId, RestaurantId} from "@delivery/common/domain";
import {RestaurantViewEntity} from "../entity/RestaurantViewEntity";

export class RestaurantDataAccessMapper {

  static restaurantToRestaurantProducts(restaurant: Restaurant): string[] {
    return restaurant.products.map(p => p.getId().getValue())
  }

  static restaurantEntitiesToRestaurant(restaurantEntities: RestaurantViewEntity[]): Restaurant {

    const [restaurantEntity] = restaurantEntities

    if ( !restaurantEntity) {
      throw new RestaurantDataAccessException("Restaurant with chosen products ids could not be found!")
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

