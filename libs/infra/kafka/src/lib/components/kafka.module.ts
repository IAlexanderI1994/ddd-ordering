import {DynamicModule, Module} from "@nestjs/common";
import {CqrsModule, EventBus} from "@nestjs/cqrs";
import KafkaSubscriber from "./KafkaSubscriber";
import KafkaProducer from "./KafkaProducer";
import {readAVSCAsync, SchemaRegistry, SchemaType} from "@kafkajs/confluent-schema-registry";
import * as path from "path";


type KafkaModuleConfig = {
  events: string[];
  clientId: string;
  groupId: string;
  schemaRegistryHost: string;
  brokers: string[];
}

@Module({})
export class KafkaModule {
  constructor(
    private readonly event$: EventBus,
    private readonly kafkaProducer: KafkaProducer,
    private readonly kafkaSubscriber: KafkaSubscriber,
  ) {
  }

  async onModuleInit(): Promise<any> {

    await this.kafkaSubscriber.connect();
    this.kafkaSubscriber.bridgeEventsTo(this.event$.subject$);

    await this.kafkaProducer.connect();
    // this.event$.publisher = this.kafkaProducer;
    console.log('KAFKA INITED!');

  }


  static forRootAsync(config: KafkaModuleConfig): DynamicModule {

    const providers = [
      {
        provide: 'EVENTS',
        useValue: config.events
      },
      {
        provide: 'CLIENT_ID',
        useValue: config.clientId
      },
      {
        provide: 'GROUP_ID',
        useValue: config.groupId
      },
      {
        provide: 'KAFKA_REGISTRY',
        useFactory: async () => {
          const registry = new SchemaRegistry({host: config.schemaRegistryHost, clientId: config.clientId})
          const schema = await readAVSCAsync(path.join(__dirname, '../avro/schema/payment_request.avsc'))
          const {id} = await registry.register(schema)

          return {registry, registryId: id}
        },
      },
      {
        provide: 'KAFKA_BROKERS',
        useValue: config.brokers
      },
      KafkaProducer,
      KafkaSubscriber
    ]
    return {
      imports: [CqrsModule],
      providers,
      exports: providers,
      module: KafkaModule
    }
  }


}
