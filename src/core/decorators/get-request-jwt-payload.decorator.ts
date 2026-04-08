import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/core/interface/jwt.interface';

export const GetRequestJwtPayload = createParamDecorator((data: any, context: ExecutionContext) => {

  const headers = context.switchToHttp().getRequest().user;

  if(!headers){
    throw new InternalServerErrorException('Headers not found')
  }

  return headers as JwtPayloadInterface;

});