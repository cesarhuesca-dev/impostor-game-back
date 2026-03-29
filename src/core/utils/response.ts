import { ApiResponse } from '../interface/response.interface';

export class ResponseBuilder {
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

  static buildSuccess(status = 200, message: string | string[] = []): ApiResponse<any> {
    const messageFormated = Array.isArray(message) ? message : [message];

    return {
      status,
      message: messageFormated,
      data: [],
      success: true
    };
  }

  static buildNotSuccess(status = 400, message: string | string[] = []): ApiResponse<any> {
    const messageFormated = Array.isArray(message) ? message : [message];

    return {
      status,
      message: messageFormated,
      data: [],
      success: false
    };
  }
}
