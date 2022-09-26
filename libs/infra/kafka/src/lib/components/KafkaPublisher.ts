import { IEventPublisher } from '@nestjs/cqrs';
import {Kafka, Partitioners, Producer} from 'kafkajs';
import { Inject } from '@nestjs/common';
import * as _ from 'lodash'
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";

class KafkaPublisher implements IEventPublisher {

  private readonly kafkaProducer: Producer
  private readonly registry: SchemaRegistry;
  private readonly registryId: number;

  constructor(
    @Inject('KAFKA_BROKERS') brokers: string[],
    @Inject('CLIENT_ID') clientId: string,
    @Inject('KAFKA_REGISTRY') schemaRegistry: { registry: SchemaRegistry, registryId: number }

  ) {
    const kafka = new Kafka({
      clientId,
      brokers,
    })

    this.kafkaProducer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    this.registry = schemaRegistry.registry;
    this.registryId = schemaRegistry.registryId
  }

  async connect(): Promise<void> {
    await this.kafkaProducer.connect();
  }

  async publish<T>(event: T): Promise<any> {
    const topic = _.snakeCase(event.constructor.name)
    this.kafkaProducer.send({
      topic,
      messages: [
        {
          value: await this.registry.encode(this.registryId, event),
        }
      ]
    })
  }
}

export default KafkaPublisher
