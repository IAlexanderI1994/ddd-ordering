import {BaseEntity, Money, OrderId, OrderItemId} from "@ordering/common/domain";
import {Product} from "./product";

export class OrderItem extends BaseEntity<OrderItemId> {

  get orderId(): OrderId {
    return this._orderId;
  }

  get product(): Product {
    return this._product;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): Money {
    return this._price;
  }

  get subtotal(): Money {
    return this._subtotal;
  }

  private _orderId: OrderId;

  private _product: Product;

  private _quantity: number;

  private _price: Money;

  private _subtotal: Money;

  private constructor(builder: typeof OrderItem.Builder.prototype) {
    super();
    super.setId(builder.orderItemId)
    this._product = builder.product
    this._quantity = builder.quantity
    this._price = builder.price
    this._subtotal = builder.subtotal

  }

  public initialize(orderId: OrderId, orderItemId: OrderItemId): void {
    this._orderId = orderId
    super.setId(orderItemId)
  }

  static builder(): typeof OrderItem.Builder.prototype {
    return new OrderItem.Builder();
  }

  static Builder = class {

    private _orderItemId: OrderItemId;
    private _product: Product;
    private _quantity: number;
    private _price: Money;
    private _subtotal: Money;

    get orderItemId(): OrderItemId {
      return this._orderItemId;
    }

    get product(): Product {
      return this._product;
    }

    get quantity(): number {
      return this._quantity;
    }

    get price(): Money {
      return this._price;
    }

    get subtotal(): Money {
      return this._subtotal;
    }

    setOrderItemId(value: OrderItemId): typeof OrderItem.Builder.prototype {
      this._orderItemId = value;
      return this;
    }

    setProduct(value: Product): typeof OrderItem.Builder.prototype {
      this._product = value;
      return this;
    }

    setQuantity(value: number): typeof OrderItem.Builder.prototype {
      this._quantity = value;
      return this;
    }

    setPrice(value: Money): typeof OrderItem.Builder.prototype {
      this._price = value;
      return this;
    }

    setSubtotal(value: Money): typeof OrderItem.Builder.prototype {
      this._subtotal = value;
      return this;
    }

    build(): OrderItem {
      return new OrderItem(this)
    }

  }

  public isPriceValid(): boolean {

    return this.price.isGreaterThanZero() &&
      this.price.equals(this.product.price) &&
      this.price.multiply(this.quantity).equals(this.subtotal)
  }

}
