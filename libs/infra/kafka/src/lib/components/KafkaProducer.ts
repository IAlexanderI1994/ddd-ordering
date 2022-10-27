import {Kafka, Partitioners, Producer, RecordMetadata} from 'kafkajs';
import {Inject, Injectable} from '@nestjs/common';
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";
import {CLIENT_ID, KAFKA_BROKERS, KAFKA_CONFIG, KAFKA_SCHEMA} from "../tokens";
import {KafkaProducerConfig} from "../types";

@Injectable()
export class KafkaProducer {

  private readonly kafkaProducer: Producer
  private readonly registry: SchemaRegistry;
  private readonly registryId: number;

  constructor(
    @Inject(KAFKA_BROKERS) brokers: string[],
    @Inject(CLIENT_ID) clientId: string,
    @Inject(KAFKA_CONFIG) private readonly config: KafkaProducerConfig,
    @Inject(KAFKA_SCHEMA) schema: { registry: SchemaRegistry, registryId: number }

  ) {
    const kafka = new Kafka({
      clientId,
      brokers,
    })

    this.kafkaProducer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    this.registry = schema.registry;
    this.registryId = schema.registryId
  }

  async connect(): Promise<void> {
    await this.kafkaProducer.connect();
  }

  async publish<T>( event: T): Promise<RecordMetadata[]> {
   return await this.kafkaProducer.send({
      topic: this.config.topic,
      messages: [
        {
          value: await this.registry.encode(this.registryId, event),
        }
      ]
    })
  }
}

export default KafkaProducer
