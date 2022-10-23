import {OrderCancelledEvent, OrderCreatedEvent} from "@ordering/orders/domain";
import {PaymentRequestAvroModel} from "@ordering/infra/kafka";
import {randomUUID} from "crypto";
import {OrderStatus} from "@ordering/common/domain";

export class OrderMessagingDataMapper {
  static orderCreatedEventToPaymentRequestAvroModel(orderCreatedEvent: OrderCreatedEvent): PaymentRequestAvroModel {

    const {order} = orderCreatedEvent
    return new PaymentRequestAvroModel({
      createdAt: orderCreatedEvent.createdAt,
      customerId: order.customerId.getValue(),
      id: randomUUID(),
      orderId: order.getId().getValue(),
      paymentOrderStatus: OrderStatus.PENDING,
      price: order.price.amount,
      sagaId: ""
    })
  }
  static orderCancelledEventToPaymentRequestAvroModel(orderCancelledEvent: OrderCancelledEvent): PaymentRequestAvroModel {

    const {order} = orderCancelledEvent
    return new PaymentRequestAvroModel({
      createdAt: orderCancelledEvent.createdAt,
      customerId: order.customerId.getValue(),
      id: randomUUID(),
      orderId: order.getId().getValue(),
      paymentOrderStatus: OrderStatus.PENDING,
      price: order.price.amount,
      sagaId: ""
    })
  }

}
