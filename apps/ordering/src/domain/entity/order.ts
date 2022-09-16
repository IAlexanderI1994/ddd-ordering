import {
  AggregateRoot,
  CustomerId,
  Money,
  OrderId,
  OrderItemId,
  OrderStatus,
  RestaurantId,
  StreetAddress,
  TrackingId
} from "@ordering/common/domain";
import {OrderItem} from "./order-item";
import {randomUUID} from "crypto";
import {OrderDomainException} from "../exception/order-domain.exception";

export class Order extends AggregateRoot<OrderId> {

  private readonly _customerId: CustomerId;
  private readonly _restaurantId: RestaurantId;
  private readonly _deliveryAddress: StreetAddress;
  private readonly _price: Money;
  private readonly _items: OrderItem[];
  private _trackingId: TrackingId
  private _orderStatus: OrderStatus
  private _failureMessages: string[] = [];

  private constructor(builder: typeof Order.Builder.prototype) {
    super();
    super.setId(builder.orderId)
    this._customerId = builder.customerId
    this._items = builder.items
    this._price = builder.price
    this._deliveryAddress = builder.deliveryAddress
    this._orderStatus = builder.orderStatus
    this._restaurantId = builder.restaurantId
    this._trackingId = builder.trackingId
    this._failureMessages = builder.failureMessages

  }


  public initialize(): void {
    this.setId(new OrderId(randomUUID()))
    this._trackingId = new TrackingId(randomUUID())
    this._orderStatus = OrderStatus.PENDING
    this.initializeOrderItems()
  }


  private initializeOrderItems(): void {
    let itemId = 1;
    for (const item of this.items) {
      item.initialize(super.getId(), new OrderItemId(itemId++))
    }
  }

  public pay(): void {
    if (this.orderStatus !== OrderStatus.PENDING) {
      throw new OrderDomainException('Order is not in correct state for pay operation')
    }
    this._orderStatus = OrderStatus.PAID
  }

  public approve(): void {
    if (this.orderStatus !== OrderStatus.PAID) {
      throw new OrderDomainException('Order is not in correct state for approve operation')
    }
    this._orderStatus = OrderStatus.APPROVED
  }

  public initCancel(failureMessages: string[]): void {
    if (this.orderStatus !== OrderStatus.PAID) {
      throw new OrderDomainException('Order is not in correct state for initCancel operation')
    }
    this._orderStatus = OrderStatus.CANCELLING
    this.updateFailureMessages(failureMessages)
  }

  public cancel(failureMessages: string[]): void {
    if (this.orderStatus !== OrderStatus.CANCELLING) {
      throw new OrderDomainException('Order is not in correct state for cancel operation')
    }
    this._orderStatus = OrderStatus.CANCELLED
    this.updateFailureMessages(failureMessages)

  }


  public validateOrder(): void {
    this.validateInitialOrder()
    this.validateTotalPrice()
    this.validateItemsPrice()
  }

  get customerId(): CustomerId {
    return this._customerId;
  }

  get restaurantId(): RestaurantId {
    return this._restaurantId;
  }

  get deliveryAddress(): StreetAddress {
    return this._deliveryAddress;
  }

  get price(): Money {
    return this._price;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get trackingId(): TrackingId {
    return this._trackingId;
  }

  get orderStatus(): OrderStatus {
    return this._orderStatus;
  }

  get failureMessages(): string[] {
    return this._failureMessages;
  }


  static builder(): typeof Order.Builder.prototype {
    return new Order.Builder();
  }

  static Builder = class {

    get orderId(): OrderId {
      return this._orderId;
    }

    setOrderId(value: OrderId) {
      this._orderId = value;
      return this;
    }

    get customerId(): CustomerId {
      return this._customerId;
    }

    setCustomerId(value: CustomerId) {
      this._customerId = value;
      return this;
    }

    get restaurantId(): RestaurantId {
      return this._restaurantId;
    }

    setRestaurantId(value: RestaurantId) {
      this._restaurantId = value;
      return this;
    }

    get deliveryAddress(): StreetAddress {
      return this._deliveryAddress;
    }

    setDeliveryAddress(value: StreetAddress) {
      this._deliveryAddress = value;
      return this;
    }

    get price(): Money {
      return this._price;
    }

    setPrice(value: Money) {
      this._price = value;
      return this;
    }

    get items(): OrderItem[] {
      return this._items;
    }

    setItems(value: OrderItem[]) {
      this._items = value;
      return this;
    }

    get trackingId(): TrackingId {
      return this._trackingId;
    }

    setTrackingId(value: TrackingId) {
      this._trackingId = value;
      return this;
    }

    get orderStatus(): OrderStatus {
      return this._orderStatus;
    }

    setOrderStatus(value: OrderStatus) {
      this._orderStatus = value;
      return this;
    }

    get failureMessages(): string[] {
      return this._failureMessages;
    }

    setFailureMessages(value: string[]) {
      this._failureMessages = value;
      return this;
    }

    private _orderId: OrderId;
    private _customerId: CustomerId;
    private _restaurantId: RestaurantId;
    private _deliveryAddress: StreetAddress;
    private _price: Money;
    private _items: OrderItem[];
    private _trackingId: TrackingId
    private _orderStatus: OrderStatus
    private _failureMessages: string[]


    build(): Order {
      return new Order(this)
    }

  }


  private validateInitialOrder() {
    if (this.orderStatus !== null || this.getId() !== null) {
      throw new OrderDomainException("Order is not in correct state")
    }
  }


  private validateTotalPrice() {
    if (this.price === null || !this.price.isGreaterThanZero()) {
      throw new OrderDomainException("Total price must be greater than zero")
    }
  }

  private validateItemsPrice() {
    const orderItemsTotal = this.items.map(orderItem => {
      this.validateItemPrice(orderItem)
      return orderItem.subtotal
    })
      .reduce((result, money) => result.add(money), Money.ZERO)

    if (!this.price.equals(orderItemsTotal)) {
      throw new OrderDomainException(`Total price: ${this.price.amount} is not equal to orderItems total: ${orderItemsTotal.amount}`)
    }
  }

  private validateItemPrice(orderItem: OrderItem) {
    if (!orderItem.isPriceValid()) {
      throw new OrderDomainException(`Order item price: ${orderItem.price.amount} is not valid for product: ${orderItem.product.getId().getValue()}`)
    }
  }

  private updateFailureMessages(failureMessages: string[]) {
    if (Array.isArray(this.failureMessages) && Array.isArray(failureMessages)) {
      this._failureMessages = this.failureMessages.concat(
        failureMessages.filter(m => m && m.length > 0)
      )
    }
  }
}
