import { LanguagesSupported } from '../enum/languages.enum';

export interface EnvInterface {
  ENVIRONMENT: EnvironmentMode;
  FALLBACK_LANGUAGE: LanguagesSupported;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: number;
  DB_HOST: string;
  HOST_API: string;
  HOST_FRONT: string;
  SERVER_PORT: number;
  JWT_SECRET: string;
  WORD_API: string;
}

export enum EnvironmentMode {
  Production = 'production',
  Development = 'development',
}
