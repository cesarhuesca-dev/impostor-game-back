/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { I18nContext, I18nValidationException } from 'nestjs-i18n';
import { ApiResponse } from '../interface/response.interface';
import { safeJsonParse } from '../utils/json-parse';

@Catch(I18nValidationException)
export class I18nCustomValidationExceptionFilter implements ExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const i18n = I18nContext.current(host);
  

    const json: ApiResponse<any> = {
      status: exception.getStatus(),
      error: i18n?.t(`status-code.${exception.getStatus()}`, {
        lang: I18nContext.current()?.lang
      }),
      message: this.formatValidationErrors(exception, i18n!),
      timestamp: new Date().toISOString(),
      success: false
    };

    return response.status(exception.getStatus()).json(json);
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
            
            const constraints = safeJsonParse(err.constraints[key].split('|')[1])?.constraints ?? [];

            errorList.push(
              i18n.t(`validation.${key}`, {
                args: { property: err.property, constraints: constraints }
              })
            );
          });
        }
      });

      return errorList;
    } catch (error) {
      return [];
    }
  }
}
