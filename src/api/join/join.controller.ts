import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JoinService } from './join.service';
import { CreateJoinGameDto } from './dto/create-join.dto';
import { VerifyGameDto } from './dto/verify-game.dto copy';
import { ResponseBuilder } from 'src/core/utils/response';
import { PlayerDto } from '../user/dto/player.dto';
import { Player } from '../user/entities/player.entity';

@Controller('join')
export class JoinController {
  constructor(private readonly joinService: JoinService) {}

  @Post('verify')
  async verifyJoinGame(@Body() verifyGameDto: VerifyGameDto) {

    const result = await this.joinService.verifyJoinGame(verifyGameDto);

    if(result){
      return ResponseBuilder.buildSuccess();
    }else{
      return ResponseBuilder.buildNotSuccess()
    }

  }

  @Post()
  async joinGame(@Body() createJoinGameDto: CreateJoinGameDto) {
    const result = await this.joinService.joinGame(createJoinGameDto)
    return ResponseBuilder.build<string>(result);
  }


}
