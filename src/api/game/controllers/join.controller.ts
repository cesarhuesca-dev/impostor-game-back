import { ResponseBuilder } from 'src/core/utils/response';
import { JoinDto } from '../dto/join.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { VerifyGameDto, CreateJoinGameDto, CreateJoinWatcherDto } from '../dto';
import { JoinService } from '../services/join.service';

@Controller('/game/join')
export class GameJoinController {
  constructor(private readonly joinService: JoinService) {}

  //#region JOIN NO AUTH

  @Post('/verify')
  async verifyJoinGame(@Body() verifyGameDto: VerifyGameDto) {
    const result = await this.joinService.verifyJoinGame(verifyGameDto);

    if (result) {
      return ResponseBuilder.buildSuccess();
    } else {
      return ResponseBuilder.buildNotSuccess();
    }
  }

  @Post('/')
  async joinGame(@Body() createJoinGameDto: CreateJoinGameDto) {
    const result = await this.joinService.joinGamePlayer(createJoinGameDto);
    return ResponseBuilder.build<JoinDto>(result);
  }

  @Post('/watcher')
  async joinWatcher(@Body() createJoinWatcherDto: CreateJoinWatcherDto) {
    const result = await this.joinService.joinGameWatcher(createJoinWatcherDto);
    return ResponseBuilder.build<JoinDto>(result);
  }

  //#endregion
}
