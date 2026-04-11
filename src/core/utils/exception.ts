import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ForbiddenException,
  RequestTimeoutException,
  MisdirectedException,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse } from '../interface/response.interface';
import { QueryFailedError } from 'typeorm';

export class ExceptionBuilder {
  static build<T>(
    data: T | T[],
    status = 200,
    success: boolean = true,
    message: string | string[] = [],
  ): ApiResponse<T> {
    const dataFormated = Array.isArray(data) ? data : [data];
    const messageFormated = Array.isArray(message) ? message : [message];

    return {
      status,
      message: messageFormated,
      data: dataFormated,
      success,
    };
  }

  static handleException(error: unknown, loggerTopic: string = ''): never {
    if (error instanceof QueryFailedError) {
      this.handleDbException(error, loggerTopic);
    } else {
      this.handleAppException(error, loggerTopic);
    }

    //SI LLEGA AQUI EL ERROR NO ESTA GESTIONADO
    const logger = new Logger(loggerTopic);
    logger.error(error);
    throw new InternalServerErrorException('INTERNAL SERVER ERROR');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static handleAppException(error: unknown, loggerTopic: string = ''): never | void {
    if (error instanceof NotFoundException) {
      throw new NotFoundException(error.getResponse());
    }

    if (error instanceof UnauthorizedException) {
      throw new UnauthorizedException(error.getResponse());
    }

    if (error instanceof ForbiddenException) {
      throw new ForbiddenException(error.getResponse());
    }

    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.getResponse());
    }

    if (error instanceof RequestTimeoutException) {
      throw new RequestTimeoutException(error.getResponse());
    }

    if (error instanceof MisdirectedException) {
      throw new MisdirectedException(error.getResponse());
    }

    if (error instanceof MethodNotAllowedException) {
      throw new MethodNotAllowedException(error.getResponse());
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static handleDbException(error: unknown, loggerTopic: string = ''): never | void {
    // if (error.code === '23505') {
    //   throw new BadRequestException(error.detail);
    // }

    // if (error.code === '22P02') {
    //   throw new BadRequestException('Product not exist');
    // }
    console.log('ERROR', error);
  }
}
