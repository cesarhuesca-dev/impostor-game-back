import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { EnvInterface } from '../interface/env.interface';
import { AuthModuleAsyncOptions } from '@nestjs/passport';

export const jwtOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvInterface>) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: "2h",
    },
    global: true
  }),
};

export const passportOptions: AuthModuleAsyncOptions = {
  imports: [],
  inject: [],
  useFactory: () => ({
    defaultStrategy : ['jwt']
  })
}