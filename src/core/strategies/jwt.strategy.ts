import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayloadInterface } from "../interface/jwt.interface";
import { EnvInterface } from "../interface/env.interface";
import { Player } from "src/api/game/entities/player.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(
    @InjectRepository(Player) private readonly userRepository : Repository<Player>,
    private readonly configService: ConfigService<EnvInterface>
  ){
    
    super({
      secretOrKey: configService.get<string>('SERVER_PORT')!,
      // ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
    
  }
  
  async validate(payload : JwtPayloadInterface): Promise<Player> {
  
    const { gameId, playerId } = payload;

    const player = await this.userRepository.findOneBy({
      id: playerId,
      game: {id: gameId}
    });

    if(!player){
      throw new UnauthorizedException('Token not valid');
    }


    return player;
  }



}