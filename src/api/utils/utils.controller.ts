import { Controller, Get, Param } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { WordService } from 'src/common/services/word.service';
import { LanguagesSupported } from 'src/core/enum/languages.enum';
import { WordCategories } from 'src/common/enums/categories.enum';

@Controller('utils')
export class UtilsController {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly wordService: WordService,
  ) {}

  @Get('clearDB')
  clearDB() {
    return this.utilsService.clearDB();
  }

  @Get('word/:category/:lng')
  randomWord(@Param('category') cat: string, @Param('lng') lng: string) {
    const category = cat as WordCategories;
    const lang = lng as LanguagesSupported;

    return this.wordService.getRandomWord(lang, category);
  }
}
