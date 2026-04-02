import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    GameModule,
    UtilsModule,
  ],
  providers: [],
  exports : []
})
export class ApiModule {}
