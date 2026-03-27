import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import { JwtModule } from '@nestjs/jwt';

import { configOptions, databaseOptions, i18nOptions, jwtOptions } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRootAsync(databaseOptions),
    JwtModule.registerAsync(jwtOptions),
    I18nModule.forRootAsync(i18nOptions)
  ],
  providers: [
    //REVISAR SI TENGO QUE PONER ESTRATEGIAS PARA EL AUTH JWT
  ],
  exports: [ConfigServerModule, ConfigModule, TypeOrmModule, JwtModule, I18nModule]
})
export class ConfigServerModule {}
