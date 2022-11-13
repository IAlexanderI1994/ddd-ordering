/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {Transport} from "@nestjs/microservices";
import {AppModule} from "./app.module";
import {AllExceptionsFilter} from "@delivery/common/application/exception-filters";


async function bootstrap() {

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.CONTRACTS_MICROSERVICE_HOST || 'contracts',
      port: process.env.PORT || 3002
    },
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
}

bootstrap();
