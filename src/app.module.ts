import { Module } from '@nestjs/common';
import { ConfigServerModule } from './core/config.module';
import { ApiModule } from './api/api.module';
import { CommonModule } from './common/common.module';
import { GameSocketModule } from './websockets/game/game-socket.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [ConfigServerModule, ApiModule, CommonModule, GameSocketModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
