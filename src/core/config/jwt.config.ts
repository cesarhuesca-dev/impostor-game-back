import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { EnvInterface } from '../interface/env.interface';

export const jwtOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvInterface>) => jwtSchema(configService)
};

const jwtSchema = (configService: ConfigService<EnvInterface>): JwtModuleOptions => {
  return {
    secret: configService.get('JWT_SECRET'),
    signOptions: { expiresIn: '2h' }
  };
};
