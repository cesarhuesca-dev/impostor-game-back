import {
  BadRequestException,
  ForbiddenException,
  Logger,
  MethodNotAllowedException,
  MisdirectedException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

export class ExceptionWsBuilder {
  static handleException(error: unknown): void {
    this.handleAppException(error);
  }

  private static handleAppException(error: unknown): never | void {
    const logger = new Logger('ExceptionWs');
    if (
      error instanceof NotFoundException ||
      error instanceof UnauthorizedException ||
      error instanceof ForbiddenException ||
      error instanceof BadRequestException ||
      error instanceof MethodNotAllowedException ||
      error instanceof MisdirectedException ||
      error instanceof RequestTimeoutException
    ) {
      const response = error.getResponse();

      if (typeof response === 'object') {
        logger.warn((response as any).message);
      } else {
        logger.warn(response);
      }
    }
  }
}
