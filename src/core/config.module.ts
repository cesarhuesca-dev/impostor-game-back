import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import { configOptions, databaseOptions, i18nOptions } from './config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { throttlerOptions } from './config/throttle.config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    ThrottlerModule.forRootAsync(throttlerOptions),
    TypeOrmModule.forRootAsync(databaseOptions),
    I18nModule.forRootAsync(i18nOptions),
  ],
  providers: [
    //REVISAR SI TENGO QUE PONER ESTRATEGIAS PARA EL AUTH JWT
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ConfigServerModule, ConfigModule, TypeOrmModule, I18nModule],
})
export class ConfigServerModule {}
