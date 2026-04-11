import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvInterface, EnvironmentMode } from '../interface/env.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

const databaseSchema = (configService: ConfigService<EnvInterface>): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    synchronize: configService.get('ENVIRONMENT') === EnvironmentMode.Production ? false : true,
    autoLoadEntities:
      configService.get('ENVIRONMENT') === EnvironmentMode.Production ? false : true,
  };
};

export const databaseOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvInterface>) => databaseSchema(configService),
};
