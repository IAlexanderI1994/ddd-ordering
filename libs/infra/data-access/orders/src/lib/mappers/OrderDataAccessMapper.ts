import {OrderEntity} from "../entity/OrderEntity";
import {Order, OrderItem, Product} from "@delivery/orders/domain";
import {plainToClass} from "class-transformer";
import {
  CustomerId,
  Money,
  OrderId,
  OrderItemId,
  ProductId,
  RestaurantId,
  StreetAddress,
  TrackingId
} from "@delivery/common/domain";
import {OrderAddressEntity} from "../entity/OrderAddressEntity";
import {OrderItemEntity} from "../entity/OrderItemEntity";

export class OrderDataAccessMapper {

  public static orderToOrderEntity(order: Order): OrderEntity {
    const orderEntity = plainToClass(OrderEntity, {
      id: order.getId().getValue(),
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      trackingId: order.trackingId,
      address: OrderDataAccessMapper.deliveryAddressToAddressEntity(order.deliveryAddress),
      price: order.price.amount,
      items: order.items.map(item => OrderDataAccessMapper.orderItemsToOrderItemEntities(item)),
      orderStatus: order.orderStatus,
      failureMessages: order.failureMessages ? order.failureMessages.join(Order.FAILURE_MESSAGE_DELIMITER) : ""
    })

    orderEntity.address.setOrder(orderEntity)
    orderEntity.orderItems.forEach(item => item.setOrder(orderEntity))

    return orderEntity
  }

  private static deliveryAddressToAddressEntity(deliveryAddress: StreetAddress): OrderAddressEntity {
    return plainToClass(OrderAddressEntity, {
      id: deliveryAddress.id,
      street: deliveryAddress.street,
      postalCode: deliveryAddress.postalCode,
      city: deliveryAddress.city
    })

  }


  private static orderItemsToOrderItemEntities(item: OrderItem): OrderItemEntity {
    return plainToClass(OrderItemEntity, {
      _id: item.getId().getValue(),
      productId: item.product.getId().getValue(),
      price: item.price,
      quantity: item.quantity,
      subTotal: item.subtotal.amount,
    });
  }

  public static orderEntityToOrder(orderEntity: OrderEntity): Order {

    return Order
      .builder()
      .setOrderId(new OrderId(orderEntity.id))
      .setCustomerId(new CustomerId(orderEntity.customerId))
      .setRestaurantId(new RestaurantId(orderEntity.restaurantId))
      .setDeliveryAddress(OrderDataAccessMapper.addressEntityToDeliveryAddress(orderEntity.address))
      .setPrice(new Money(orderEntity.price))
      .setItems(OrderDataAccessMapper.orderItemEntitiesToOrderItems(orderEntity.orderItems))
      .setTrackingId(new TrackingId(orderEntity.trackingId))
      .setOrderStatus(orderEntity.orderStatus)
      .setFailureMessages(orderEntity.failureMessages.length > 0 ? orderEntity.failureMessages.split(Order.FAILURE_MESSAGE_DELIMITER): [])
      .build()


  }

  private static addressEntityToDeliveryAddress(address: OrderAddressEntity): StreetAddress {
    return new StreetAddress(
      address.id,
      address.street,
      address.postalCode,
      address.city
    );
  }

  private static orderItemEntitiesToOrderItems(orderItems: OrderItemEntity[]) {
    return orderItems.map(item => OrderItem
      .builder()
      .setOrderItemId(new OrderItemId(item.id))
      .setProduct(new Product(new ProductId(item.productId)))
      .setPrice(new Money(item.price))
      .setQuantity(item.quantity)
      .setSubtotal(new Money(item.subTotal))
      .build()
    );
  }
}
