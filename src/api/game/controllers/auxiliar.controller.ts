import { BadRequestException, Controller, Get } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { AuxiliarService } from '../services/auxiliar.service';
import { ResponseBuilder } from 'src/core/utils/response';
import { ItemListInterface } from 'src/common/interfaces/list.interface';

@Controller('/auxiliar')
export class AuxiliarController {
  constructor(
    private readonly auxiliarService: AuxiliarService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  @Get('/categories')
  async getCategories() {
    const categories = await this.auxiliarService.getCategories();

    if (!categories) {
      throw new BadRequestException(this.i18n.t('exceptions.badRequest'));
    }

    return ResponseBuilder.build<ItemListInterface[]>(categories);
  }

  @Get('/languages')
  async getLanguages() {
    const languages = await this.auxiliarService.getLanguages();

    if (!languages) {
      throw new BadRequestException(this.i18n.t('exceptions.badRequest'));
    }

    return ResponseBuilder.build<ItemListInterface[]>(languages);
  }
}
