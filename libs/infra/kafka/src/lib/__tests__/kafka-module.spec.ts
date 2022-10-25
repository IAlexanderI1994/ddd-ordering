import {ConsoleLogger, INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {KafkaModule} from "../components/kafka.module";
import {CommandBus, CqrsModule, EventBus, QueryBus} from "@nestjs/cqrs";
import axios from 'axios'
import {randomUUID} from "crypto";
import {
  CreateOrderKafkaMessagePublisher
} from "@ordering/orders/messaging";
import {Order, OrderCreatedEvent, OrderPaidEvent} from "@ordering/orders/domain";
import {ConfigModule} from "@nestjs/config";
import {CustomerId, Money, OrderId, OrderStatus} from "@ordering/common/domain";
import * as path from "path";
import {
  PaymentRequestMessagingModule
} from "../../../../../orders/messaging/src/lib/modules/PaymentRequestMessagingModule";

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
          groupId: "ordering-group",
          schemaRegistryHost: "http://localhost:8081/"
        }),
        KafkaModule.forConsumer(
          {
            schemaPath: path.join(__dirname, './avro/payment_request.avsc'),
            topic: "payment_request"
          }
        ),
        PaymentRequestMessagingModule
      ],
      providers: [
        EventBus,
        CommandBus,
        QueryBus,
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

  it('should correctly process created event', async function () {

    const order: Order = Order
      .builder()
      .setCustomerId(new CustomerId(randomUUID()))
      .setOrderId(new OrderId(randomUUID()))
      .setOrderStatus(OrderStatus.PENDING)
      .setPrice(new Money(1000))
      .build()
    const orderCreatedEvent = new OrderCreatedEvent(order, new Date().toISOString())

    const result = await publisher.publish(orderCreatedEvent)


    await new Promise(r => setTimeout(r, 1000))
  });

  it('should correctly process restaurant approval event', async function () {

    const order: Order = Order
      .builder()
      .setCustomerId(new CustomerId(randomUUID()))
      .setOrderId(new OrderId(randomUUID()))
      .setOrderStatus(OrderStatus.PENDING)
      .setPrice(new Money(1000))
      .build()
    const orderPaidEvent = new OrderPaidEvent(order, new Date().toISOString())

    const result = await publisher.publish(orderPaidEvent)


    await new Promise(r => setTimeout(r, 1000))
  });


});
