import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { ApiResponse } from '../interface/response.interface';

export class ExceptionBuilder {
  static build<T>(
    data: T | T[],
    status = 200,
    success: boolean = true,
    message: string | string[] = []
  ): ApiResponse<T> {
    const dataFormated = Array.isArray(data) ? data : [data];
    const messageFormated = Array.isArray(message) ? message : [message];

    return {
      status,
      message: messageFormated,
      data: dataFormated,
      success
    };
  }

  static handleException(error: unknown, loggerTopic: string = ''): never {
    // if (error.code === '23505') {
    //   throw new BadRequestException(error.detail);
    // }

    // if (error.code === '22P02') {
    //   throw new BadRequestException('Product not exist');
    // }

    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.getResponse());
    }

    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.getResponse());
    }

    //!TODO SI LLEGA AQUI EL ERROR NO ESTA GESTIONADO
    const logger = new Logger(loggerTopic);
    logger.error(error);
    throw new InternalServerErrorException('INTERNAL SERVER ERROR');
  }
}
