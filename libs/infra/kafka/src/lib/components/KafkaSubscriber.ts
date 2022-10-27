import {IEvent, IMessageSource} from '@nestjs/cqrs';
import {Subject} from 'rxjs';
import {Consumer, Kafka} from 'kafkajs';
import {Inject, Injectable} from '@nestjs/common';
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";
import {CLIENT_ID, KAFKA_BROKERS, KAFKA_CONFIG, KAFKA_SCHEMA} from "../tokens";
import {KafkaConsumerConfig} from "../types";

@Injectable()
export class KafkaSubscriber implements IMessageSource {

  private readonly kafkaConsumer: Consumer
  private bridge: Subject<any>
  private readonly registry: SchemaRegistry;
  private readonly registryId: number;

  constructor(
    @Inject(KAFKA_BROKERS) brokers: string[],
    @Inject(KAFKA_CONFIG) private readonly config: KafkaConsumerConfig,
    @Inject(CLIENT_ID) clientId: string,
    @Inject(KAFKA_SCHEMA) schema: { registry: SchemaRegistry, registryId: number },
  ) {
    const kafka = new Kafka({
      brokers,
      clientId,
    })
    const { groupId } = config

    this.kafkaConsumer = kafka.consumer({groupId});
    this.registry = schema.registry;
    this.registryId = schema.registryId
  }

  async connect(): Promise<void> {

    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({topic: this.config.topic, fromBeginning: false})

    await this.kafkaConsumer.run({
      eachMessage: async ({topic, message}) => {
        if (this.bridge) {
          if ( topic === this.config.topic) {
            const parsedJson = await this.registry.decode(message.value)
            console.log(parsedJson)
          }
        }
      }
    })
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }

}

export default KafkaSubscriber;
