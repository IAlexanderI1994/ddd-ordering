import {ConsoleLogger, INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {injectEnv} from "@delivery/test-utils";
import {AppModule} from "../app.module";

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
