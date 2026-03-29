import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  controllers: [],
  imports: [JwtModule],
  providers: [AuthService, JwtService],
  exports : [AuthModule, JwtService]
})
export class AuthModule {}
