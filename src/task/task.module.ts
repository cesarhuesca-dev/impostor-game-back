import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RemoveTrashService } from './services/remove-trash.service';
import { GameModule } from 'src/api/game/game.module';

@Module({
  imports: [ScheduleModule.forRoot(), GameModule],
  providers: [RemoveTrashService],
  exports: [TaskModule],
})
export class TaskModule {}
