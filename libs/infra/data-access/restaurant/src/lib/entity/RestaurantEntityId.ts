export class RestaurantEntityId {
  readonly restaurantId: string;
  readonly productId: string;

    equals(o: object): boolean {
        return o instanceof RestaurantEntityId &&
          this.restaurantId === o.restaurantId &&
          this.productId === o.productId
      }
}
