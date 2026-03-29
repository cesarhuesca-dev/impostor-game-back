import { Module } from '@nestjs/common';
import { JoinService } from './join.service';
import { JoinController } from './join.controller';
import { GameService } from '../game/game.service';
import { GameModule } from '../game/game.module';
import { PlayerModule } from '../user/player.module';
import { PlayerService } from '../user/player.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports : [
    GameModule,
    PlayerModule,
    AuthModule
  ],
  controllers: [JoinController],
  providers: [
    JoinService,
    GameService,
    PlayerService,
    AuthService
  ]
})
export class JoinModule {}
