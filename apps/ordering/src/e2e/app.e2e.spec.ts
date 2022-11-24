import {ConsoleLogger, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {injectEnv} from "@delivery/test-utils";
import {AppModule} from "../app.module";
import * as request from 'supertest';
import {CreateOrderCommand} from "@delivery/orders/application";
import {randomUUID} from "crypto";

jest.setTimeout(30000)
describe('Orders application', () => {
  let app: INestApplication;

  injectEnv()
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
      controllers: []
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useLogger(new ConsoleLogger())
    app.useGlobalPipes(new ValidationPipe({transform: true}))
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', function () {
    expect.assertions(1)
    expect(app).toBeDefined()
  });

  it('should correctly handle create order request', async function () {

    const payload: CreateOrderCommand = {
      address: {
        street: 'Hello',
        postalCode: '12342',
        city: "Moscow"
      },
      customerId: randomUUID(),
      orderItems: [
        {
          productId: "123",
          price: 600,
          quantity: 1,
          subtotal: 600
        }
      ],
      price: 600,
      restaurantId: randomUUID()
    }

    await request(app.getHttpServer())
      .post('/orders')
      .send(payload)
      .expect(r => {
        console.log(r.body)
      })

  });


});
