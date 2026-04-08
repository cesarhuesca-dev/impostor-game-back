import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { WordService } from 'src/common/services/word.service';

@Controller('utils')
export class UtilsController {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly wordService: WordService
  ) {}


  @Get('clearDB')
  clearDB() {
    return this.utilsService.clearDB();
  }

  @Get('word')
  randomWord() {
    return this.wordService.getRandomWord();
  }

}
