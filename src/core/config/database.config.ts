import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType, EnvInterface, EnvironmentMode } from '../interface/env.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const databaseSchema = (configService: ConfigService<EnvInterface>): TypeOrmModuleOptions => {
  const logger = new Logger('DatabaseType');

  if (configService.get('DB_TYPE') === DatabaseType.Postgres) {
    logger.log('Database postgres selected');
    return {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      database: configService.get('DB_NAME'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      synchronize: configService.get('ENVIRONMENT') === EnvironmentMode.Production ? false : true,
      autoLoadEntities: true,
        // configService.get('ENVIRONMENT') === EnvironmentMode.Production ? false : true,
      logging: configService.get('ENVIRONMENT') !== EnvironmentMode.Production,
    };
  } else {
    logger.log('Database sqlite selected');
    return {
      type: 'sqlite',
      database: `data/db.${configService.get('DB_NAME')}`,
      synchronize: configService.get('ENVIRONMENT') === EnvironmentMode.Production ? false : true,
      autoLoadEntities:
        configService.get('ENVIRONMENT') === EnvironmentMode.Production ? false : true,
    };
  }
};

export const databaseOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvInterface>) => databaseSchema(configService),
};
