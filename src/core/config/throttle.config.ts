import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvInterface } from '../interface/env.interface';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';

export const throttlerOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvInterface>) => ({
    throttlers: [
      {
        ttl: configService.get('THROTTLE_TTL')!,
        limit: configService.get('THROTTLE_LIMIT')!,
      },
    ],
  }),
};
