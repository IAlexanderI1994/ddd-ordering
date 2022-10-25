import {Kafka, Partitioners, Producer, RecordMetadata} from 'kafkajs';
import {Inject, Injectable} from '@nestjs/common';
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";
import { KAFKA_SCHEMA, KAFKA_TOPIC} from "../tokens";

@Injectable()
export class KafkaProducer {

  private readonly kafkaProducer: Producer
  private readonly registry: SchemaRegistry;
  private readonly registryId: number;

  constructor(
    @Inject('KAFKA_BROKERS') brokers: string[],
    @Inject('CLIENT_ID') clientId: string,
    @Inject(KAFKA_TOPIC) private readonly topic: string,
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
      topic: this.topic,
      messages: [
        {
          value: await this.registry.encode(this.registryId, event),
        }
      ]
    })
  }
}

export default KafkaProducer
