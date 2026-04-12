import Joi from 'joi';
import z from 'zod';

import { DatabaseType, EnvInterface, EnvironmentMode } from '../interface/env.interface';
import { ConfigModuleOptions } from '@nestjs/config';
import { LanguagesSupported } from '../enum/languages.enum';

const envValidationSchema = () => {
  return Joi.object({
    ENVIRONMENT: Joi.string()
      .required()
      .valid(...Object.values(EnvironmentMode)),
    FALLBACK_LANGUAGE: Joi.string()
      .required()
      .valid(...Object.values(LanguagesSupported)),

    //DATABASE
    DB_TYPE: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().port().required(),

    //SERVER
    SERVER_PORT: Joi.number().port().required(),
    HOST_API: Joi.string().required(),
    HOST_FRONT: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),

    //WORD API
    WORD_API: Joi.string().required(),
  });
};

const envZodSchema = z.object({
  ENVIRONMENT: z.literal(Object.values(EnvironmentMode)),
  FALLBACK_LANGUAGE: z.literal(Object.values(LanguagesSupported)),
  //DATABASE
  DB_TYPE: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  //SERVER
  SERVER_PORT: z.coerce.number(),
  HOST_API: z.string(),
  HOST_FRONT: z.string(),
  JWT_SECRET: z.string(),
  //WORD API
  WORD_API: z.string(),
});

export const envs = (): EnvInterface => {
  const parsed = envZodSchema.parse(process.env);

  return {
    ENVIRONMENT:
      parsed.ENVIRONMENT === EnvironmentMode.Production
        ? EnvironmentMode.Production
        : EnvironmentMode.Development,
    FALLBACK_LANGUAGE: parsed.FALLBACK_LANGUAGE,
    DB_TYPE: parsed.DB_TYPE === DatabaseType.Postgres ? DatabaseType.Postgres : DatabaseType.Sqlite,
    DB_USER: parsed.DB_USER,
    DB_PASSWORD: parsed.DB_PASSWORD,
    DB_NAME: parsed.DB_NAME,
    DB_HOST: parsed.DB_HOST,
    DB_PORT: parsed.DB_PORT,
    SERVER_PORT: parsed.SERVER_PORT,
    HOST_API: parsed.HOST_API,
    HOST_FRONT: parsed.HOST_FRONT,
    JWT_SECRET: parsed.JWT_SECRET,
    WORD_API: parsed.WORD_API,
  };
};

export const configOptions: ConfigModuleOptions = {
  validationSchema: envValidationSchema(),
  isGlobal: true,
  load: [envs],
};
