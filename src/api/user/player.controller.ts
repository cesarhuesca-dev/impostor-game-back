import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { ResponseBuilder } from 'src/core/utils/response';
import { Player } from './entities/player.entity';
import { PlayerDto } from './dto/player.dto';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly userService: PlayerService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}


  @Get(':id')
  async getPlayer(@Param('id', ParseUUIDPipe) id: string) {
    
    const result = await this.userService.findOne(id);

    if(!result){
      throw new NotFoundException(this.i18n.t('entities.player.alreadyExist'));
    }
    
    return ResponseBuilder.build<PlayerDto>(Player.toPlain(result));
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {

    const result = await this.userService.remove(id);

    if(!result) return ResponseBuilder.buildNotSuccess();

    return ResponseBuilder.buildSuccess();
  }
}
