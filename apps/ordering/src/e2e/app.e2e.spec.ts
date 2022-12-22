import {ConsoleLogger, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {injectEnv, OrderingProcessDataSeeder} from "@delivery/test-utils";
import {AppModule} from "../app.module";
import * as request from 'supertest';
import {CreateOrderCommand} from "@delivery/orders/application";
import {AllExceptionsFilter} from "@delivery/common/application/exception-filters";
import {getRepositoryToken} from "@nestjs/typeorm";
import {CustomerEntity} from "@delivery/infra/data-access/customer";
import {Repository} from "typeorm";
import {RestaurantEntity} from "@delivery/infra/data-access/restaurant";

jest.setTimeout(30000)
describe('Orders application', () => {
  let app: INestApplication;

  let data: {customerId: string, restaurantId: string};
  let customerEntityRepository: Repository<CustomerEntity>;
  let restaurantEntityRepository: Repository<RestaurantEntity>;

  injectEnv()
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
      ],
      controllers: []
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useLogger(new ConsoleLogger())
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe({transform: true}))
    await app.init();
    customerEntityRepository = await app.resolve(getRepositoryToken(CustomerEntity))
    restaurantEntityRepository = await app.resolve(getRepositoryToken(RestaurantEntity))

    const seeder = new OrderingProcessDataSeeder(customerEntityRepository, restaurantEntityRepository)

    data = await seeder.seed()

  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', function () {
    expect.assertions(1)
    expect(app).toBeDefined()
  });

  it('should correctly handle create order request', async function () {

    console.log(data)
    const payload: CreateOrderCommand = {
      address: {
        street: 'Hello',
        postalCode: '12342',
        city: "Moscow"
      },
      customerId: data.customerId,
      orderItems: [
        {
          productId: "123",
          price: 600,
          quantity: 1,
          subtotal: 600
        }
      ],
      price: 600,
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
