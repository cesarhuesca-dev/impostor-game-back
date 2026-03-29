import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { PlayerModule } from './user/player.module';
import { JoinModule } from './join/join.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    GameModule,
    PlayerModule,
    JoinModule,
    UtilsModule
  ],
  providers: [],
  exports : []
})
export class ApiModule {}
