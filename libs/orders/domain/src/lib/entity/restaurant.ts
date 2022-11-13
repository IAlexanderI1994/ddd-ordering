import {
  AggregateRoot,
  RestaurantId,
} from "@delivery/common/domain";
import {Product} from "./product";

export class Restaurant extends AggregateRoot<RestaurantId> {
  get products(): Product[] {
    return this._products;
  }

  get isActive(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  private readonly _products: Product[];

  private _active: boolean;

  constructor(builder: typeof Restaurant.Builder.prototype) {
    super();
    super.setId(builder.restaurantId)
    this._products = builder.products
    this.active = builder.active
  }

  static builder(): typeof Restaurant.Builder.prototype {
    return new Restaurant.Builder();
  }

  static Builder = class {

    get restaurantId(): RestaurantId {
      return this._restaurantId;
    }
    setRestaurantId(value: RestaurantId) {
      this._restaurantId = value;
      return this
    }

    get products(): Product[] {
      return this._products;
    }
    setProducts(value: Product[]) {
      this._products = value;
      return this
    }

    get active(): boolean {
      return this._active;
    }
    setActive(value: boolean) {
      this._active = value;
      return this;
    }

    private _restaurantId: RestaurantId;
    private _products: Product[];
    private _active: boolean;



    build(): Restaurant {
      return new Restaurant(this)
    }

  }


}
