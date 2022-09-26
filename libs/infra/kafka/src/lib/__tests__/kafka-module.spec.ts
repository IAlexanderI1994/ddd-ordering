import {INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {KafkaModule} from "../components/kafka.module";
import {CommandBus, CqrsModule, EventBus, QueryBus} from "@nestjs/cqrs";
import {TestingEventPublisher} from "@ordering/test-utils";
import {PaymentRequest} from "./event.mock";
import {OrderStatus} from "@ordering/common/domain";
import {randomUUID} from "crypto";

jest.setTimeout(30000)
describe(KafkaModule, () => {
  let app: INestApplication;
  let publisher: TestingEventPublisher;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
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
        TestingEventPublisher
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
    publisher = app.get<TestingEventPublisher>(TestingEventPublisher)

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', function () {
    expect.assertions(2)
    expect(app).toBeDefined()
    expect(publisher).toBeDefined()
  });

  it('should correctly process event', async function () {

    const result = await publisher.publish(new PaymentRequest( randomUUID()))

    await new Promise(r => setTimeout(r, 10000))
  });


});
