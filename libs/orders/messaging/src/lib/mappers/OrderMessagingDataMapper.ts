import {OrderStatus} from "@ordering/common/domain";
import {OrderCancelledEvent, OrderCreatedEvent, OrderPaidEvent} from "@ordering/orders/domain";
import {
  PaymentRequestAvroModel,
  PaymentResponseAvroModel,
  RestaurantApprovalRequestAvroModel,
  RestaurantApprovalResponseAvroModel
} from "@ordering/infra/kafka";
import {PaymentResponseDto, RestaurantApprovalResponseDto} from "@ordering/orders/application";
import {randomUUID} from "crypto";
import { plainToInstance} from "class-transformer";


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

  static approvalResponseAvroModelToApprovalResponse(restaurantApprovalResponseAvroModel: RestaurantApprovalResponseAvroModel): RestaurantApprovalResponseDto {
    return plainToInstance(RestaurantApprovalResponseDto, {...restaurantApprovalResponseAvroModel}, { excludeExtraneousValues: true } );
  }

}
