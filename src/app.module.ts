import { Module } from '@nestjs/common';
import { ConfigServerModule } from './core/config.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ConfigServerModule, ApiModule],
  controllers: [],
  providers: []
})
export class AppModule {}
