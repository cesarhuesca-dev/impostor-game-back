export interface EnvInterface {
  ENVIRONMENT: EnvironmentMode;
  FALLBACK_LANGUAGE: SupportLanguages;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: number;
  DB_HOST: string;
  HOST_API: string;
  SERVER_PORT: number;
  JWT_SECRET: string;
}

export enum EnvironmentMode {
  Production = 'production',
  Development = 'development'
}

export enum SupportLanguages {
  ES = 'es',
  EN = 'en'
}
