import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";
import {PaymentResponseAvroModel, RestaurantApprovalResponseAvroModel} from "@ordering/infra/kafka";
import {PaymentResponseDto, RestaurantApprovalResponseDto} from "@ordering/orders/application";
import {plainToInstance} from "class-transformer";

describe(OrderMessagingDataMapper, () => {

    it(OrderMessagingDataMapper.paymentResponseAvroModelToPaymentResponse.name, async function () {

      expect.assertions(1)
      const avro: PaymentResponseAvroModel = new PaymentResponseAvroModel({
        createdAt: "",
        customerId: "",
        failureMessages: [],
        id: "",
        orderId: "",
        paymentId: "",
        paymentOrderStatus: undefined,
        price: 0,
        sagaId: ""
      })

      const result = OrderMessagingDataMapper.paymentResponseAvroModelToPaymentResponse(avro)

      expect(result).toBeInstanceOf(PaymentResponseDto)
    });

  it(OrderMessagingDataMapper.approvalResponseAvroModelToApprovalResponse.name, function () {

    expect.assertions(1)
    const avro: RestaurantApprovalResponseAvroModel = new RestaurantApprovalResponseAvroModel({
      orderApprovalStatus: undefined,
      createdAt: "",
      failureMessages: [],
      id: "",
      orderId: "",
      paymentId: "",
      sagaId: ""
    })

    const result: RestaurantApprovalResponseDto = OrderMessagingDataMapper.approvalResponseAvroModelToApprovalResponse(avro)

    expect(result).toBeInstanceOf(RestaurantApprovalResponseDto)
  });


});
