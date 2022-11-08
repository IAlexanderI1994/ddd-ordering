import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";
import {PaymentResponseAvroModel} from "@ordering/infra/kafka";
import {validate, validateOrReject} from "class-validator";
import {PaymentResponseDto} from "../../../../application/src/lib/dto/message/PaymentResponse";

describe(OrderMessagingDataMapper, () => {

    it('should correctly map data(avro response to dto response) ', async function () {

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


});
