import {Consumer, Kafka} from 'kafkajs';
import {Inject, Injectable, Optional} from '@nestjs/common';
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";
import {CLIENT_ID, KAFKA_BROKERS, KAFKA_CONFIG, KAFKA_EVENT_VISITOR, KAFKA_HANDLER, KAFKA_SCHEMA} from "../tokens";
import {IKafkaHandler, KafkaConsumerConfig, KafkaVisitor} from "../types";

@Injectable()
export class KafkaSubscriber {

  private readonly kafkaConsumer: Consumer
  private readonly registry: SchemaRegistry;
  private readonly registryId: number;

  constructor(
    @Inject(KAFKA_BROKERS) brokers: string[],
    @Inject(KAFKA_CONFIG) private readonly config: KafkaConsumerConfig,
    @Inject(CLIENT_ID) clientId: string,
    @Inject(KAFKA_SCHEMA) schema: { registry: SchemaRegistry, registryId: number },
    @Inject(KAFKA_HANDLER) private readonly handler: IKafkaHandler,
    @Optional()
    @Inject(KAFKA_EVENT_VISITOR) private readonly kafkaEventVisitor: KafkaVisitor
  ) {

    const kafka = new Kafka({
      brokers,
      clientId,
    })
    const {groupId} = config

    this.kafkaConsumer = kafka.consumer({groupId});
    this.registry = schema.registry;
    this.registryId = schema.registryId

    this.eachMessage = this.eachMessage.bind(this)
  }

  async eachMessage({topic, message}) {
      if (topic === this.config.topic) {
        const avroModel = await this.registry.decode(message.value)
        await this.kafkaEventVisitor?.visit(avroModel)
        this.handler.handle(avroModel)

      }
  }

  async connect(): Promise<void> {
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({topic: this.config.topic, fromBeginning: false})
    await this.kafkaConsumer.run({
        eachMessage: this.eachMessage
      }
    )
  }
}

export default KafkaSubscriber;
