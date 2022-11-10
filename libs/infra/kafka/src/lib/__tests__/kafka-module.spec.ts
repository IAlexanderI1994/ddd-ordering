import {ConsoleLogger, INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {KafkaModule} from "../components/kafka.module";
import { CqrsModule} from "@nestjs/cqrs";
import axios from 'axios'
import {randomUUID} from "crypto";
import {
  CreateOrderKafkaMessagePublisher,
  PAYMENT_GROUP_ID,
  PAYMENT_REQUEST_TOPIC_NAME,
  PaymentRequestMessagingModule,
  PayOrderKafkaMessagePublisher,
  RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME,
  RESTAURANT_GROUP_ID,
  RestaurantRequestMessagingModule
} from "@ordering/orders/messaging";
import {Order, OrderCreatedEvent} from "@ordering/orders/domain";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {CustomerId, Money, OrderId, OrderStatus} from "@ordering/common/domain";
import * as path from "path";
import {KAFKA_BROKERS, KAFKA_EVENT_VISITOR} from "../tokens";
import {TestModule} from "./test-module";
import {PaymentRequestListener} from "../../../../../orders/messaging/src/lib/listeners/PaymentRequestListener";

jest.setTimeout(30000)
describe(KafkaModule, () => {

  let app: INestApplication;


  let mockFn = jest.fn();
  let promiseResolve;
  let promise: Promise<any>;


  let createOrderKafkaMessagePublisher: CreateOrderKafkaMessagePublisher;
  let payOrderKafkaMessagePublisher: PayOrderKafkaMessagePublisher;


  process.env[PAYMENT_REQUEST_TOPIC_NAME] = 'payment_request'
  process.env[PAYMENT_GROUP_ID] = 'payment-group'
  process.env[RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME] = 'restaurant_approval_request'
  process.env[RESTAURANT_GROUP_ID] = 'restaurant-group'

  beforeEach(async () => {
    const prefix = 'http://localhost:8081/subjects/com.food.ordering.system.kafka.order.avro.model'
    const revalidateSchemas = [
      `PaymentRequestAvroModel`,
      `RestaurantApprovalRequestAvroModel`,
    ].map(name => `${prefix}.${name}`)

    try {
      const res = await Promise.all(
        revalidateSchemas.map(schema => axios.delete(schema))
      )

    } catch (e) {

      console.error(e)
    }
    const resetPromise = () => {
      promise = new Promise<any>(r => {
        promiseResolve = r
      })
    }
    resetPromise()
    mockFn.mockClear()


    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule,
        ConfigModule.forRoot({isGlobal: true}),
        CqrsModule,
        KafkaModule.forRootAsync({
          brokers: [
            'kafka-broker-1:19092:19092',
            'kafka-broker-2:29092:19092',
            'kafka-broker-3:39092:19092'
          ],
          clientId: "ordering-app",
          schemaRegistryHost: "http://localhost:8081/"
        }),
        // KafkaModule.forConsumerAsync(
        //   {
        //     schemaPath: path.join(__dirname, './avro/restaurant_approval_request.avsc'),
        //     config: {
        //       useFactory: (config: ConfigService) => {
        //         return {
        //           topic: config.getOrThrow<string>(RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME),
        //           groupId: config.getOrThrow<string>(RESTAURANT_GROUP_ID),
        //         }
        //       },
        //       inject: [ConfigService],
        //     }
        //   }
        // ),
        KafkaModule.forConsumerAsync(
          {
            schemaPath: path.join(__dirname, './avro/payment_request.avsc'),
            listener: PaymentRequestListener,
            config: {
              useFactory: (config: ConfigService) => {
                return {
                  topic: config.getOrThrow<string>(PAYMENT_REQUEST_TOPIC_NAME),
                  groupId: config.getOrThrow<string>(PAYMENT_GROUP_ID),
                }
              },
              inject: [ConfigService],
            }
          }
        ),
        PaymentRequestMessagingModule,
        RestaurantRequestMessagingModule,
      ]
    })
      .overrideProvider(KAFKA_BROKERS)
      .useValue([
        'localhost:19092:19092',
        'localhost:29092:29092',
        'localhost:39092:39092'
      ])
      .overrideProvider(KAFKA_EVENT_VISITOR)
      .useValue(
        {
          visit: (...args) => {
            console.log(args)
            mockFn()
            promiseResolve()
          }
        }
      )
      .compile();

    app = moduleFixture.createNestApplication();

    createOrderKafkaMessagePublisher = app.get<CreateOrderKafkaMessagePublisher>(CreateOrderKafkaMessagePublisher)
    payOrderKafkaMessagePublisher = app.get<PayOrderKafkaMessagePublisher>(PayOrderKafkaMessagePublisher)

    app.useLogger(new ConsoleLogger())
    await app.init();


  });


  afterAll(async () => {
    await app.close();
  });

  it('should be defined', function () {
    expect.assertions(2)
    expect(app).toBeDefined()
    expect(createOrderKafkaMessagePublisher).toBeDefined()
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

    const result = await createOrderKafkaMessagePublisher.publish(orderCreatedEvent)


    await new Promise(r => setTimeout(r, 10000))
  });


  // it('should correctly process restaurant approval event', async function () {
  //
  //   expect.assertions(1)
  //   const items = Array.apply(null, {length: 4}).map(i => OrderItem
  //     .builder()
  //     .setOrderItemId(new OrderItemId(randomUUID()))
  //     .setQuantity(2)
  //     .build()
  //   )
  //
  //   const order: Order = Order
  //     .builder()
  //     .setCustomerId(new CustomerId(randomUUID()))
  //     .setRestaurantId(new RestaurantId(randomUUID()))
  //     .setOrderId(new OrderId(randomUUID()))
  //     .setOrderStatus(OrderStatus.PENDING)
  //     .setPrice(new Money(1000))
  //     .setItems(items)
  //     .build()
  //   const orderPaidEvent = new OrderPaidEvent(order, new Date().toISOString())
  //
  //   await payOrderKafkaMessagePublisher.publish(orderPaidEvent)
  //
  //   expect(mockFn).toHaveBeenCalledTimes(1)
  // });



});
