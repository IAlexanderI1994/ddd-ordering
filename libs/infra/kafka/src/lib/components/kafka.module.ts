import {DynamicModule, Module, Optional} from "@nestjs/common";
import {readAVSCAsync, SchemaRegistry} from "@kafkajs/confluent-schema-registry";
import KafkaSubscriber from "./KafkaSubscriber";
import KafkaProducer from "./KafkaProducer";
import {CLIENT_ID, KAFKA_BROKERS, KAFKA_CONFIG, KAFKA_HANDLER, KAFKA_REGISTRY, KAFKA_SCHEMA} from "../tokens";
import {
  KafkaModuleConfig,
  KafkaConsumerOptions,
  KafkaProducerOptions
} from "../types";

@Module({})
export class KafkaModule {
  constructor(
    @Optional() private readonly kafkaProducer: KafkaProducer,
    @Optional() private readonly kafkaSubscriber: KafkaSubscriber,
  ) {
  }

  async onModuleInit(): Promise<any> {

    await this.kafkaSubscriber?.connect();

    await this.kafkaProducer?.connect();
  }

  static forRootAsync(config: KafkaModuleConfig): DynamicModule {

    const providers = [
      {
        provide: CLIENT_ID,
        useValue: config.clientId
      },
      {
        provide: KAFKA_REGISTRY,
        useValue: new SchemaRegistry({host: config.schemaRegistryHost, clientId: config.clientId})
      },
      {
        provide: KAFKA_BROKERS,
        useValue: config.brokers
      },
    ]
    return {
      global: true,
      providers,
      exports: [...providers],
      module: KafkaModule
    }
  }

  static forProducerAsync(options: KafkaProducerOptions): DynamicModule {
    const {schemaPath} = options

    return {
      providers: [
        {
          provide: KAFKA_SCHEMA,
          useFactory: async (registry: SchemaRegistry) => {
            const schema = await readAVSCAsync(schemaPath)
            const {id} = await registry.register(schema)

            return {registry, registryId: id}
          },
          inject: [KAFKA_REGISTRY]
        },
        {
          provide: KAFKA_CONFIG,
          useFactory: options.config.useFactory,
          inject: options.config.inject
        },
        KafkaProducer
      ],
      exports: [
        KafkaProducer
      ],
      module: KafkaModule
    }
  }


  static forConsumerAsync(options: KafkaConsumerOptions): DynamicModule {

    const {schemaPath} = options
    return {
      providers: [
        {
          provide: KAFKA_SCHEMA,
          useFactory: async (registry: SchemaRegistry) => {
            const schema = await readAVSCAsync(schemaPath)
            const {id} = await registry.register(schema)

            return {registry, registryId: id}
          },
          inject: [KAFKA_REGISTRY]
        },
        {
          provide: KAFKA_HANDLER,
          useClass: options.listener
        },
        {
          provide: KAFKA_CONFIG,
          useFactory: options.config.useFactory,
          inject: options.config.inject
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
