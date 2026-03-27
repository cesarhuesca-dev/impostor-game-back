/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { ApiResponse } from '../interface/response.interface';

@Catch()
export class I18nExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const i18n = I18nContext.current(host);
    const errorResposne: {
      message: string;
      error: string;
      statusCode: number;
    } = exception.getResponse();

    console.log(errorResposne);

    let json: ApiResponse<any> = {
      status: 0,
      success: false
    };

    if (i18n) {
      const errorList = this.formatValidationErrors(exception, i18n);

      json = {
        status: errorResposne.statusCode,
        error: i18n?.t(`status-code.${errorResposne.statusCode}`, {
          lang: I18nContext.current()?.lang
        }),
        message: errorList,
        timestamp: new Date().toISOString(),
        success: false
      };
    } else {
      //!TODO INTENTAR TRADUCIR ESTE ERROR CUANDO NO SE PUEDE CONTROLAR CON CONTEXTO DE TRADUCCION
      json = {
        status: errorResposne.statusCode,
        error: errorResposne.error,
        message: [errorResposne.message],
        timestamp: new Date().toISOString(),
        success: false
      };
    }

    return response.status(errorResposne.statusCode).json(json);
  }

  private formatValidationErrors(exception: any, i18n: I18nContext) {
    const errors: any[] = exception.errors ?? [];
    const errorMessage: string = exception?.response?.message || null;
    const errorList: string[] = [];

    try {
      if (errorMessage) {
        errorList.push(errorMessage);
      }

      errors.forEach((err) => {
        if (typeof err === 'string') {
          errorList.push(err);
        }

        if (err.constraints) {
          Object.keys(err.constraints).forEach((key) => {
            const constraints = JSON.parse(err.constraints[key].split('|')[1]).constraints ?? [];

            errorList.push(
              i18n.t(`validation.${key}`, {
                args: { property: err.property, constraints: constraints }
              })
            );
          });
        }
      });

      return errorList;
    } catch {
      return [];
    }
  }
}
