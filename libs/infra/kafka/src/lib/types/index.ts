export type KafkaModuleConfig = {
  clientId: string;
  schemaRegistryHost: string;
  brokers: string[];
}

export type KafkaProducerConfig = {
  topic: string;
}
export type KafkaConsumerConfig = KafkaProducerConfig & {
  groupId: string;
}

export type KafkaBaseOptions<T extends KafkaProducerConfig | KafkaConsumerConfig> = {
  config: {
    useFactory: (...args) => T;
    inject?: any[]
  };
  schemaPath: string;
}

export type KafkaProducerOptions = KafkaBaseOptions<KafkaProducerConfig>
export type KafkaConsumerOptions = KafkaBaseOptions<KafkaConsumerConfig> & {
  listener: { new() }
}

export interface IKafkaHandler   {
  handle(event: any);
}

export interface KafkaVisitor {
  visit(...args);
}
