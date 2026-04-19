import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { UtilsModule } from './utils/utils.module';
import { EnvironmentMode } from 'src/core/interface/env.interface';

@Module({
  imports: [
    GameModule,
    ...(process.env.ENVIRONMENT === EnvironmentMode.Development ? [UtilsModule] : []),
  ],
  providers: [],
  exports: [],
})
export class ApiModule {}
