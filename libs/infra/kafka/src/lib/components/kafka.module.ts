import {DynamicModule, Module, Optional} from "@nestjs/common";
import {CqrsModule, EventBus} from "@nestjs/cqrs";
import {readAVSCAsync, SchemaRegistry} from "@kafkajs/confluent-schema-registry";
import KafkaSubscriber from "./KafkaSubscriber";
import KafkaProducer from "./KafkaProducer";
import {KAFKA_REGISTRY, KAFKA_SCHEMA, KAFKA_TOPIC} from "../tokens";


type KafkaModuleConfig = {
  clientId: string;
  groupId: string;
  schemaRegistryHost: string;
  brokers: string[];
}

type PublisherConfig = {
  topic: string;
  schemaPath: string
}

@Module({})
export class KafkaModule {
  constructor(
    private readonly event$: EventBus,
    @Optional() private readonly kafkaProducer: KafkaProducer,
    @Optional() private readonly kafkaSubscriber: KafkaSubscriber,
  ) {
  }

  async onModuleInit(): Promise<any> {

    await this.kafkaSubscriber?.connect();
    this.kafkaSubscriber?.bridgeEventsTo(this.event$.subject$);

    await this.kafkaProducer?.connect();
  }


  static forRootAsync(config: KafkaModuleConfig): DynamicModule {

    const providers = [
      {
        provide: 'CLIENT_ID',
        useValue: config.clientId
      },
      {
        provide: 'GROUP_ID',
        useValue: config.groupId
      },
      {
        provide: KAFKA_REGISTRY,
        useValue: new SchemaRegistry({host: config.schemaRegistryHost, clientId: config.clientId})
      },
      {
        provide: 'KAFKA_BROKERS',
        useValue: config.brokers
      },
      // KafkaProducer,
      // KafkaSubscriber
    ]
    return {
      global: true,
      imports: [CqrsModule],
      providers,
      exports: [...providers, CqrsModule],
      module: KafkaModule
    }
  }

  static forProducer(config: PublisherConfig): DynamicModule {


    return {
      providers: [
        {
          provide: KAFKA_SCHEMA,
          useFactory: async (registry: SchemaRegistry) => {
            const schema = await readAVSCAsync(config.schemaPath)
            const {id} = await registry.register(schema)

            return {registry, registryId: id}
          },
          inject: [KAFKA_REGISTRY]
        },
        {
          provide: KAFKA_TOPIC,
          useValue: config.topic,
        },
        KafkaProducer
      ],
      exports: [
        KafkaProducer
      ],
      module: KafkaModule
    }

  }

  static forConsumer(config: PublisherConfig): DynamicModule {


    return {
      providers: [
        {
          provide: KAFKA_SCHEMA,
          useFactory: async (registry: SchemaRegistry) => {
            const schema = await readAVSCAsync(config.schemaPath)
            const {id} = await registry.register(schema)

            return {registry, registryId: id}
          },
          inject: [KAFKA_REGISTRY]
        },
        {
          provide: KAFKA_TOPIC,
          useValue: config.topic,
        },
        KafkaSubscriber
      ],
      exports: [
        KafkaSubscriber
      ],
      module: KafkaModule
    }

  }


}
