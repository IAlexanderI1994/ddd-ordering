import {INestApplication, Injectable} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
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
import {CustomerEntity, CustomersDataAccessModule} from "@delivery/infra/data-access/customer";
import {injectEnv} from "@delivery/test-utils";
import {Transactional} from "@delivery/infra/data-access/common";
import {EntityManager} from "typeorm";
import {TransactionsHelper} from "../../helpers/transactions.helper";

describe(Transactional, () => {
  let app: INestApplication;
  let tc: TestClass;
  let m: EntityManager;
  injectEnv()


  @Injectable()
  class TestClass {


    testLogic = async () => {
      const transactionManager: EntityManager = TransactionsHelper.getTransactionEntityManager() || m

      if (!TransactionsHelper.getTransactionEntityManager()) {
        console.warn('Not inside transaction')
      }
      await transactionManager.save(CustomerEntity, {
        name: 'name3'
      })
      throw new Error('some error')
      await transactionManager.save(CustomerEntity, {
        name: 'name2'
      })
    }

    @Transactional()
    async doWithTransactional() {

      await this.testLogic()
    }

    async doWithoutTransactional() {
      await this.testLogic()

    }


  }

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
        CustomersDataAccessModule,
      ],
      providers: [
        TestClass
      ],
      controllers: []
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    tc = app.get(TestClass)

    m = app.get(EntityManager)


  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', function () {
    expect.assertions(2)
    expect(app).toBeDefined()
    expect(tc).toBeDefined()
  });

  it('should not create no one user', async function () {
    expect.assertions(1)


    await m.clear(CustomerEntity)
    try {
      await tc.doWithTransactional()

    } catch (e) {
      console.error(e)
    }

    const result = await m.find(CustomerEntity)

    expect(result).toHaveLength(0)
  });

  it('should  create 1 user', async function () {
    expect.assertions(1)


    await m.clear(CustomerEntity)
    try {
      await tc.doWithoutTransactional()

    } catch (e) {
      console.error(e)
    }

    const result = await m.find(CustomerEntity)

    expect(result).toHaveLength(1)
  });
  it('should  create 1 user - 2 spec', async function () {
    expect.assertions(1)


    await m.clear(CustomerEntity)
    try {
      await tc.doWithTransactional()

    } catch (e) {
      console.error(e)
    }

    try {
      await tc.doWithoutTransactional()

    } catch (e) {
      console.error(e)
    }

    const result = await m.find(CustomerEntity)

    expect(result).toHaveLength(1)
  });


});
