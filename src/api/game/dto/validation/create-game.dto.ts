import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class CreateGameDto {
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.isString') })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', { constraints: [3] }),
  })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  roomName!: string;

  @IsString({ message: i18nValidationMessage('validation.isString') })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', { constraints: [3] }),
  })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  roomPassword!: string;

  @IsNumber({}, { message: i18nValidationMessage<I18nTranslations>('validation.isNumber') })
  @Min(4, {
    message: i18nValidationMessage<I18nTranslations>('validation.min', { constraints: [4] }),
  })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  roomPlayers!: number;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  customWords!: boolean;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  specificCategory!: boolean;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.isString') })
  @IsOptional()
  category!: string;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  multipleImpostors!: boolean;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty') })
  overlay!: boolean;
}
