import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';
import { WordService } from 'src/common/services/word.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [UtilsController],
  imports: [CommonModule],
  providers: [UtilsService, WordService],
})
export class UtilsModule {}
