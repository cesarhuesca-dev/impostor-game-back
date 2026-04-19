import { Logger } from '@nestjs/common';

export class ExceptionWsBuilder {
  static handleException(error: unknown): void {
    const logger = new Logger('ExceptionWs');
    logger.debug(error);
  }
}
