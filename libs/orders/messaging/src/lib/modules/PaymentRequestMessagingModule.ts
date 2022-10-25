import {Module} from "@nestjs/common"
import {KafkaModule} from "@ordering/infra/kafka";
import {CreateOrderKafkaMessagePublisher} from "../publisher/CreateOrderKafkaMessagePublisher";
import {CancelOrderKafkaMessagePublisher} from "../publisher/CancelOrderKafkaMessagePublisher";
import * as path from "path";

@Module({
    imports: [
      KafkaModule.forProducer({
        schemaPath: path.join(__dirname, '../avro/payment_request.avsc'),
        topic: 'payment_request'
      })
    ],
    providers: [
      CreateOrderKafkaMessagePublisher,
      CancelOrderKafkaMessagePublisher
    ],
    controllers: [],
    exports: [],
})
export class PaymentRequestMessagingModule {}
