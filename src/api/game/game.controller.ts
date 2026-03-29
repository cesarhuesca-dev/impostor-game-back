import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ResponseBuilder } from 'src/core/utils/response';
import { GameDto } from './dto/game.dto';
import { Game } from './entities/game.entity';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    
    const result = await this.gameService.findOne(id);

    if(!result){
      throw new NotFoundException(this.i18n.t('entities.game.notFound'));
    }

    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    const result = await this.gameService.create(createGameDto);
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateGameDto: UpdateGameDto) {
    const result = await this.gameService.update(id, updateGameDto)
    return ResponseBuilder.build<GameDto>(Game.toPlain(result));
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.gameService.remove(id);

    if(!result) return ResponseBuilder.buildNotSuccess();

    return ResponseBuilder.buildSuccess();
  }
}
