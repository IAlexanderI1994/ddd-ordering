import {IEvent, IMessageSource} from '@nestjs/cqrs';
import {Subject} from 'rxjs';
import {Consumer, Kafka} from 'kafkajs';
import {Inject, Injectable} from '@nestjs/common';
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";
import {KAFKA_SCHEMA, KAFKA_TOPIC} from "../tokens";

@Injectable()
export class KafkaSubscriber implements IMessageSource {

  private readonly kafkaConsumer: Consumer
  private bridge: Subject<any>
  private readonly registry: SchemaRegistry;
  private readonly registryId: number;

  constructor(
    @Inject('KAFKA_BROKERS') brokers: string[],
    @Inject('CLIENT_ID') clientId: string,
    @Inject('GROUP_ID') groupId: string,
    @Inject(KAFKA_SCHEMA) schema: { registry: SchemaRegistry, registryId: number },
    @Inject(KAFKA_TOPIC) private readonly topic: string
  ) {
    const kafka = new Kafka({
      brokers,
      clientId,
    })

    this.kafkaConsumer = kafka.consumer({groupId});
    this.registry = schema.registry;
    this.registryId = schema.registryId
  }

  async connect(): Promise<void> {

    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({topic: 'payment_request', fromBeginning: false})

    await this.kafkaConsumer.run({
      eachMessage: async ({topic, partition, message}) => {
        if (this.bridge) {
          if ( topic === this.topic) {
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
