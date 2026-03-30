import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [
    AuthService,
    FilesService,
    JwtService
  ],
  exports : [CommonModule]
})
export class CommonModule {}
