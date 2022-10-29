import {Global, Module} from "@nestjs/common"
import {KAFKA_EVENT_VISITOR} from "../tokens";

@Global()
@Module({
    imports: [],
    providers: [
      {
        provide: KAFKA_EVENT_VISITOR,
        useValue: ''
      },
    ],
    controllers: [],
    exports: [KAFKA_EVENT_VISITOR],
})
export class TestModule{}
