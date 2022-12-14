import {Order, OrderItem, Product, Restaurant} from "@delivery/orders/domain";
import {CustomerId, Money, ProductId, RestaurantId, StreetAddress} from "@delivery/common/domain";
import {OrderAddressDto} from "../dto/orders/OrderAddress";
import {randomUUID} from "crypto";
import {ExtendedOrderItemDto, OrderItemDto} from "../dto/orders/OrderItemDto";
import {CreateOrderResponseDto} from "../dto/orders/CreateOrderResponse";
import {plainToClass} from "class-transformer";
import {TrackOrderResponseDto} from "../dto/track/TrackOrderResponse";
import {ExtendedCreateOrderCommandDto} from "../dto/orders/OrderCommandDto";

export class OrderDataMapper {

  static createOrderCommandToRestaurant(createOrderDto: ExtendedCreateOrderCommandDto): Restaurant {

    return Restaurant.builder()
      .setRestaurantId(new RestaurantId(createOrderDto.restaurantId))
      .setProducts(
        createOrderDto
          .orderItems
          .map(oi => new Product(new ProductId(oi.productId)))
      )
      .build()

  }

  static orderToOrderCreateResponse(order: Order, message?: string): CreateOrderResponseDto {
    return plainToClass(CreateOrderResponseDto, {
      trackingId: order.trackingId,
      orderStatus: order.orderStatus,
      message
    })

  }

  static createOrderCommandToOrder(createOrderDto: ExtendedCreateOrderCommandDto): Order {

    return Order
      .builder()
      .setCustomerId(new CustomerId(createOrderDto.customerId))
      .setRestaurantId(new RestaurantId(createOrderDto.restaurantId))
      .setDeliveryAddress(this.orderAddressToStreetAddress(createOrderDto.address))
      .setPrice(new Money(createOrderDto.price))
      .setItems(this.orderItemsToOrderItemsEntities(createOrderDto.orderItems))
      .build()
  }

  static orderToTrackOrderResponse(order: Order): TrackOrderResponseDto {
    return plainToClass(TrackOrderResponseDto, {
      failureMessages: order.failureMessages,
      orderStatus: order.orderStatus,
      orderTrackingId: order.trackingId
    })

  }

  private static orderAddressToStreetAddress(address: OrderAddressDto) {
    return new StreetAddress(
      randomUUID(),
      address.street,
      address.postalCode,
      address.city,
    );
  }

  private static orderItemsToOrderItemsEntities(orderItems: ExtendedOrderItemDto[]): OrderItem[] {
    return orderItems.map(
      oi => OrderItem
        .builder()
        .setProduct(new Product(new ProductId(oi.productId)))
        .setPrice(new Money(oi.price))
        .setQuantity(oi.quantity)
        .setSubtotal(new Money(oi.subtotal))
        .build()
    )
  }

}
