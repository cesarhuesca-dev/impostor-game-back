import { Module } from '@nestjs/common';
import { ConfigServerModule } from './core/config.module';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigServerModule, ApiModule, AuthModule],
  controllers: [],
  providers: []
})
export class AppModule {}
