import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { configOptions, databaseOptions, i18nOptions, jwtOptions, passportOptions } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRootAsync(databaseOptions),
    I18nModule.forRootAsync(i18nOptions),
    JwtModule.registerAsync(jwtOptions),
    PassportModule.registerAsync(passportOptions),
  ],
  providers: [
    //REVISAR SI TENGO QUE PONER ESTRATEGIAS PARA EL AUTH JWT
  ],
  exports: [ConfigServerModule, ConfigModule, TypeOrmModule, I18nModule, JwtModule, PassportModule]
})
export class ConfigServerModule {}
