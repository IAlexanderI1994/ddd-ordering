import {INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {OrdersDataAccessModule} from "../OrdersDataAccessModule";
import {OrderRepositoryImpl} from "../repository/OrderRepositoryImpl";

describe(OrdersDataAccessModule, () => {
    let app: INestApplication;

    let repo: OrderRepositoryImpl;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [OrdersDataAccessModule],
            providers: [],
            controllers: []
        }).compile();

        app = moduleFixture.createNestApplication();

        repo = app.get<OrderRepositoryImpl>(OrderRepositoryImpl)
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be defined', function () {
        expect.assertions(1)
        expect(app).toBeDefined()
    });




});
