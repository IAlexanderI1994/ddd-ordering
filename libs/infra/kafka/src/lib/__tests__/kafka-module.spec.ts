import {ConsoleLogger, INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {KafkaModule} from "../components/kafka.module";
import {CommandBus, CqrsModule, EventBus, QueryBus} from "@nestjs/cqrs";
import { PaymentRequestAvroModel} from "@ordering/infra/kafka";
import axios from 'axios'
import {randomUUID} from "crypto";
import {
  CreateOrderKafkaMessagePublisher
} from "@ordering/orders/messaging";
import {OrderMessagingDataMapper} from "../../../../../orders/messaging/src/lib/mappers/OrderMessagingDataMapper";
import {Order, OrderCreatedEvent} from "@ordering/orders/domain";
import {ConfigModule} from "@nestjs/config";
import {CustomerId, Money, OrderId, OrderStatus} from "@ordering/common/domain";

jest.setTimeout(30000)
describe(KafkaModule, () => {
  let app: INestApplication;
  let publisher: CreateOrderKafkaMessagePublisher;


  process.env.PAYMENT_REQUEST_TOPIC_NAME = 'payment_request'
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        CqrsModule,
        KafkaModule.forRootAsync({
          brokers: [
            'kafka-broker-1:19092:19092',
            'kafka-broker-2:29092:19092',
            'kafka-broker-3:39092:19092'
          ],
          clientId: "ordering-app",
          events: [],
          groupId: "ordering-group",
          // schemaRegistryHost: "http://schema-registry:8081/"
          schemaRegistryHost: "http://localhost:8081/"
        })
      ],
      providers: [
        EventBus,
        CommandBus,
        QueryBus,
        CreateOrderKafkaMessagePublisher
      ]
    })
      .overrideProvider('KAFKA_BROKERS')
      .useValue([
        'localhost:19092:19092',
        'localhost:29092:29092',
        'localhost:39092:39092'
      ])
      .compile();

    app = moduleFixture.createNestApplication();

    publisher = app.get<CreateOrderKafkaMessagePublisher>(CreateOrderKafkaMessagePublisher)

    app.useLogger(new ConsoleLogger())
    await app.init();
  });

  beforeEach(async () => {


    await axios.delete('http://localhost:8081/subjects/kafka.order.avro.model.PaymentRequestAvroModel')
  })

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', function () {
    expect.assertions(2)
    expect(app).toBeDefined()
    expect(publisher).toBeDefined()
  });

  it('should correctly process event', async function () {

    const order: Order = Order
      .builder()
      .setCustomerId(new CustomerId(randomUUID()))
      .setOrderId(new OrderId(randomUUID()))
      .setOrderStatus( OrderStatus.PENDING)
      .setPrice(new Money(1000))
      .build()
    const orderCreatedEvent = new OrderCreatedEvent(order, new Date().toISOString())

    const result = await publisher.publish( orderCreatedEvent)


    await new Promise(r => setTimeout(r, 1000))
  });


});
