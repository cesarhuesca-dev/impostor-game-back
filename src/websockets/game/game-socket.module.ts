import { Global, Module } from '@nestjs/common';
import { GameSocketGateway } from './game-socket.gateway';
import { CommonModule } from 'src/common/common.module';
import { AuthService } from 'src/common/services/auth.service';
import { GameSocketService } from './game-socket.service';
import { GameModule } from 'src/api/game/game.module';
import { GameService, PlayerService } from 'src/api/game/services';
import { FilesService } from 'src/common/services/files.service';

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
  ],
  exports : [
    GameSocketModule,
    GameSocketService
  ]
})
export class GameSocketModule {}
