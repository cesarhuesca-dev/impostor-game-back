import { ResponseBuilder } from 'src/core/utils/response';
import { JoinDto } from '../dto/join.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { VerifyGameDto, CreateJoinGameDto } from '../dto';
import { JoinService } from '../services/join.service';

@Controller('/game/join')
export class GameJoinController {
  constructor(
    private readonly joinService: JoinService,
  ) {}

  //#region JOIN REGION

  @Post('/verify')
  async verifyJoinGame(@Body() verifyGameDto: VerifyGameDto) {

    const result = await this.joinService.verifyJoinGame(verifyGameDto);

    if(result){
      return ResponseBuilder.buildSuccess();
    }else{
      return ResponseBuilder.buildNotSuccess();
    }

  }

  @Post('/')
  async joinGame(@Body() createJoinGameDto: CreateJoinGameDto) {
    const result = await this.joinService.joinGame(createJoinGameDto)
    return ResponseBuilder.build<JoinDto>(result);
  }

  //#endregion

}
