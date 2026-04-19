import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsString, IsInt, IsOptional, IsPositive, IsBoolean } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class UpdateGameDto extends PartialType(OmitType(CreateGameDto, ['category'])) {
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.isInt') })
  @IsPositive({ message: i18nValidationMessage<I18nTranslations>('validation.isPositive') })
  @IsOptional()
  roomPlayersJoined?: number;

  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.isInt') })
  @IsPositive({ message: i18nValidationMessage<I18nTranslations>('validation.isPositive') })
  @IsOptional()
  round?: number;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean') })
  @IsOptional()
  showingWord?: boolean;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean') })
  @IsOptional()
  showingImpostor?: boolean;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.isBoolean') })
  @IsOptional()
  gameStarted?: boolean;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.isString') })
  @IsOptional()
  word?: string | null;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.isString') })
  @IsOptional()
  category?: string | null;
}
