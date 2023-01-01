import {ConsoleLogger, INestApplication, ValidationPipe} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {TransformCreateOrderCommandToExtendedDto} from "../TransformCreateOrderCommandToExtendedDto";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule, TypeOrmModuleAsyncOptions} from "@nestjs/typeorm";
import {
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_PWD,
  DB_TYPE,
  DB_USERNAME,
  getDatasource
} from "@delivery/infra/data-access/config";
import {RestaurantsDataAccessModule, RestaurantTypeORMRepository} from "@delivery/infra/data-access/restaurant";
import {AllExceptionsFilter} from "@delivery/common/application/exception-filters";
import {injectEnv, OrderingProcessDataSeeder} from "@delivery/test-utils";
import {OrdersDataAccessModule} from "@delivery/infra/data-access/orders";
import {CustomersDataAccessModule} from "@delivery/infra/data-access/customer";
import {CreateOrderCommandDto} from "@delivery/orders/application";

describe(TransformCreateOrderCommandToExtendedDto, () => {
  let app: INestApplication;

  let pipe: TransformCreateOrderCommandToExtendedDto;
  let data: { customerId: string, restaurantId: string; productId: string };


  injectEnv()
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRootAsync({
          useFactory(configSvc: ConfigService) {
            const params = {
              type: configSvc.getOrThrow(DB_TYPE),
              host: configSvc.getOrThrow(DB_HOST),
              port: +configSvc.getOrThrow(DB_PORT),
              username: configSvc.getOrThrow(DB_USERNAME),
              password: configSvc.getOrThrow(DB_PWD),
              database: configSvc.getOrThrow(DB_NAME),
            }
            return <TypeOrmModuleAsyncOptions>{
              autoLoadEntities: true,
              synchronize: process.env.NODE_ENV !== 'production',
              ...params,
            }
          },
          dataSourceFactory: async (options) => {
            return getDatasource(options);
          },
          inject: [ConfigService]
        }),
        RestaurantsDataAccessModule,
        OrdersDataAccessModule,
        CustomersDataAccessModule,
      ],
      providers: [],
      controllers: []
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useLogger(new ConsoleLogger())
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe({transform: true}))

    await app.init();

    const repo = app.get(RestaurantTypeORMRepository)
    pipe = new TransformCreateOrderCommandToExtendedDto(repo)
    const seeder = await OrderingProcessDataSeeder.create(app)

    data = await seeder.seed()
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', function () {
    expect.assertions(2)
    expect(app).toBeDefined()
    expect(pipe).toBeDefined()
  });

  it('should correctly map data', async function () {


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
    const result = await pipe.transform(payload, { }as any)


  });


});
