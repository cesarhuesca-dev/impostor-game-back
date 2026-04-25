import { LanguagesSupported } from '../enum/languages.enum';

export interface EnvInterface {
  ENVIRONMENT: EnvironmentMode;
  FALLBACK_LANGUAGE: LanguagesSupported;
  DB_TYPE: DatabaseType;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: number;
  DB_HOST: string;
  HOST_FRONT: string;
  SERVER_PORT: number;
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  JWT_SECRET: string;
  WORD_API: string;
}

export enum EnvironmentMode {
  Production = 'production',
  Development = 'development',
}
export enum DatabaseType {
  Sqlite = 'sqlite',
  Postgres = 'postgres',
}
