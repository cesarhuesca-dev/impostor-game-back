import { Module } from '@nestjs/common';
import { ConfigServerModule } from './core/config.module';
import { ApiModule } from './api/api.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigServerModule, ApiModule, CommonModule],
  controllers: [],
  providers: []
})
export class AppModule {}
