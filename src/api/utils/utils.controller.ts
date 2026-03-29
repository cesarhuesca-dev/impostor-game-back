import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}


  @Get('clearDB')
  findAll() {
    return this.utilsService.clearDB();
  }

}
