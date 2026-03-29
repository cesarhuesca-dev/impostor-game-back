import { Injectable } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/core/interface/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { EnvInterface } from 'src/core/interface/env.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvInterface>
  ){
    
  }
  
  getJwtToken( gameId: string, playerId:string ): string {

    const payload : JwtPayloadInterface = {
      gameId,
      playerId
    }

    return this.jwtService.sign(payload, {secret : this.configService.get('JWT_SECRET')});
  }

  verifyJwtToken(token: string) : JwtPayloadInterface | null {

    try {
      const verified = this.jwtService.verify(token, {secret : this.configService.get('JWT_SECRET')});

      if(!verified){
        return null;
      }

      return verified;
    } catch (error) {
      return null
    }
    
  }
}
