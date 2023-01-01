import {ConsoleLogger, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {injectEnv, OrderingProcessDataSeeder} from "@delivery/test-utils";
import {AppModule} from "../app.module";
import * as request from 'supertest';
import {CreateOrderCommandDto} from "@delivery/orders/application";
import {AllExceptionsFilter} from "@delivery/common/application/exception-filters";


jest.setTimeout(30000)
describe('Orders application', () => {
  let app: INestApplication;

  let data: { customerId: string, restaurantId: string; productId: string };


  injectEnv()
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
      controllers: []
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useLogger(new ConsoleLogger())
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe({transform: true}))
    await app.init();

    const seeder = await OrderingProcessDataSeeder.create(app)

    data = await seeder.seed()

  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', async function () {
    expect.assertions(1)
    expect(app).toBeDefined()
  });

  it('should correctly handle create order request', async function () {

    const payload: CreateOrderCommandDto = {
      address: {
        street: 'Hello',
        postalCode: '12342',
        city: "Moscow"
      },
      customerId: data.customerId,
      orderItems: [
        {
          productId: data.productId,
          quantity: 1,
        }
      ],
      restaurantId: data.restaurantId
    }

    await request(app.getHttpServer())
      .post('/orders')
      .send(payload)
      .expect(r => {
        console.log(r.body)
      })

  });


});
