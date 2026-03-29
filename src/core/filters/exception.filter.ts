/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { ApiResponse } from '../interface/response.interface';


/**
 * ESTA CONTROLADOR MANEJA LAS EXCEPCIONES GENERALES Y FORZADAS
 */

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorResposne: {
      message: string;
      error: string;
      statusCode: number;
    } = exception.getResponse();

    // console.log(exception)



      //!TODO INTENTAR TRADUCIR ESTE ERROR CUANDO NO SE PUEDE CONTROLAR CON CONTEXTO DE TRADUCCION
      const json: ApiResponse<any> = {
        status: errorResposne.statusCode,
        error: errorResposne.error,
        message: [errorResposne.message],
        timestamp: new Date().toISOString(),
        success: false
      };
    

    return response.status(errorResposne.statusCode).json(json);
  }

}
