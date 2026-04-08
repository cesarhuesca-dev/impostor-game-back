import { Global, Module } from '@nestjs/common';
import { GameSocketGateway } from './game-socket.gateway';
import { CommonModule } from 'src/common/common.module';
import { AuthService } from 'src/common/services/auth.service';
import { GameSocketService } from './game-socket.service';
import { GameModule } from 'src/api/game/game.module';
import { FilesService } from 'src/common/services/files.service';
import { WordService } from 'src/common/services/word.service';
import { PlayerService } from 'src/api/game/services/player.service';
import { GameService } from 'src/api/game/services/game.service';

@Global()
@Module({
  imports : [
    CommonModule,
    GameModule
  ],
  providers: [
    GameSocketGateway,
    GameSocketService,
    AuthService,
    FilesService,
    GameService,
    PlayerService,
    WordService
  ],
  exports : [
    GameSocketModule,
    GameSocketService
  ]
})
export class GameSocketModule {}
