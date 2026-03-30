import { Injectable } from '@nestjs/common';
import { EnvInterface } from 'src/core/interface/env.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {

  constructor(
    private readonly configService: ConfigService<EnvInterface>
  ){
    
  }
  
  
}
