import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class CreateGameDto {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString', {
      property: 'roomName'
    })
  })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      property: 'roomName',
      constraints: [3]
    })
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty', {
      property: 'roomName'
    })
  })
  roomName: string;

  @IsString({ message: i18nValidationMessage('validation.isString', { property: 'roomPassword' }) })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      property: 'roomPassword',
      constraints: [3]
    })
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty', {
      property: 'roomPassword'
    })
  })
  roomPassword: string;

  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.isNumber', {
        property: 'roomPlayers'
      })
    }
  )
  @Min(4, {
    message: i18nValidationMessage<I18nTranslations>('validation.min', {
      property: 'roomPlayers',
      constraints: [4]
    })
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty', {
      property: 'roomPlayers'
    })
  })
  roomPlayers: number;

  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.isBoolean', {
      property: 'customWords'
    })
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty', {
      property: 'customWords'
    })
  })
  customWords: boolean;

  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.isBoolean', {
      property: 'category'
    })
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty', {
      property: 'category'
    })
  })
  specificCategory: boolean;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString', {
      property: 'specificCategory'
    })
  })
  @IsOptional()
  category: string;

  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.isBoolean', {
      property: 'multipleImpostors'
    })
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty', {
      property: 'multipleImpostors'
    })
  })
  multipleImpostors: boolean;

  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.isBoolean', {
      property: 'overlay'
    })
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty', {
      property: 'overlay'
    })
  })
  overlay: boolean;
}
