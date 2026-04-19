import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { WordService } from './services/word.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [JwtModule, HttpModule],
  providers: [AuthService, FilesService, JwtService, WordService],
  exports: [
    CommonModule,
    JwtModule,
    HttpModule,
    AuthService,
    FilesService,
    JwtService,
    WordService,
  ],
})
export class CommonModule {}
