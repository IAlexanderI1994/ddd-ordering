import {
  BaseEntity, Money,
  ProductId,
} from "@ordering/common/domain";

export class Product extends BaseEntity<ProductId> {

  get name(): string {
    return this._name;
  }

  get price(): Money {
    return this._price;
  }

  private  _name: string;
  private  _price: Money;

  constructor(productId: ProductId, name: string, price: Money) {
    super();
    super.setId(productId)
    this._name = name;
    this._price = price;
  }


  updateWithConfirmedNameAndPrice(name: string, price: Money) {
    this._name = name;
    this._price = price

  }
}
