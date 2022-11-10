import {OrderCancelledEvent, OrderCreatedEvent, OrderPaidEvent, Product} from "@ordering/orders/domain";
import {
  PaymentRequestAvroModel,
  PaymentResponseAvroModel,
  RestaurantApprovalRequestAvroModel
} from "@ordering/infra/kafka";
import {randomUUID} from "crypto";
import {OrderStatus} from "@ordering/common/domain";
import {PaymentResponseDto} from "../../../../application/src/lib/dto/message/PaymentResponse";
import {instanceToInstance, plainToInstance} from "class-transformer";
import {
  RestaurantApprovalResponseAvroModel
} from "../../../../../infra/kafka/src/lib/avro/models/RestaurantApprovalResponseAvroModel";
import {RestaurantApprovalResponseDto} from "../../../../application/src/lib/dto/message/RestaurantApprovalResponse";

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
      paymentOrderStatus: OrderStatus.CANCELLED,
      price: order.price.amount,
      sagaId: ""
    })
  }
  static orderPaidEventToRestaurantApprovalRequestAvroModel(orderPaidEvent: OrderPaidEvent): RestaurantApprovalRequestAvroModel {

    const {order} = orderPaidEvent

    return new RestaurantApprovalRequestAvroModel({
      products: order.items.map(i => ({
        id: i.getId().getValue().toString(),
        quantity: i.quantity
      })),
      createdAt: orderPaidEvent.createdAt,
      restaurantId: order.restaurantId.getValue().toString(),
      id: randomUUID(),
      orderId: order.getId().getValue(),
      restaurantOrderStatus: OrderStatus.PAID,
      price: order.price.amount,
      sagaId: ""
    })
  }

  static paymentResponseAvroModelToPaymentResponse(paymentResponseAvroModel: PaymentResponseAvroModel): PaymentResponseDto {
    return plainToInstance(PaymentResponseDto, {...paymentResponseAvroModel})
  }

  static approvalResponseAvroModelToApprovalResponse(restaurantApprovalResponseAvroModel:RestaurantApprovalResponseAvroModel): RestaurantApprovalResponseDto {
    return;

  }

}
