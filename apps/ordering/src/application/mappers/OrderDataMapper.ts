import {Order, OrderItem, Product, Restaurant} from "@ordering/orders/domain";
import {CreateOrderDto} from "../dto/orders/CreateOrderDto";
import {CustomerId, Money, ProductId, RestaurantId, StreetAddress} from "@ordering/common/domain";
import {OrderAddressDto} from "../dto/orders/OrderAddress";
import {randomUUID} from "crypto";
import {OrderItemDto} from "../dto/orders/OrderItemDto";
import {CreateOrderResponseDto} from "../dto/orders/CreateOrderResponse";
import {plainToClass} from "class-transformer";

export class OrderDataMapper {

  static createOrderCommandToRestaurant(createOrderDto: CreateOrderDto): Restaurant {

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

  static createOrderCommandToOrder(createOrderDto: CreateOrderDto): Order {

    return Order
      .builder()
      .setCustomerId(new CustomerId(createOrderDto.customerId))
      .setRestaurantId(new RestaurantId(createOrderDto.restaurantId))
      .setDeliveryAddress(this.orderAddressToStreetAddress(createOrderDto.address))
      .setPrice(new Money(createOrderDto.price))
      .setItems(this.orderItemsToOrderItemsEntities(createOrderDto.orderItems))
      .build()
  }

  private static orderAddressToStreetAddress(address: OrderAddressDto) {
    return new StreetAddress(
      randomUUID(),
      address.street,
      address.postalCode,
      address.city,
    );
  }

  private static orderItemsToOrderItemsEntities(orderItems: OrderItemDto[]): OrderItem[] {
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
