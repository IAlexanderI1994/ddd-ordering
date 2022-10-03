import {ArgumentsHost, Catch, ExceptionFilter,  Logger} from "@nestjs/common";
import {ErrorDTO} from "./dto/ErrorDTO";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): ErrorDTO {

    this.logger.error(JSON.stringify(exception))

    return {
      timestamp: new Date().toISOString(),
      errors: [
        exception
      ]
    }


  }
}
