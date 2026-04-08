import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Player } from "src/api/game/entities/player.entity";
import { JwtPayloadInterface } from "src/core/interface/jwt.interface";
import { EnvInterface } from "src/core/interface/env.interface";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  
  constructor(
    @InjectRepository(Player) private readonly playerRepository : Repository<Player>,
    private readonly configService: ConfigService<EnvInterface>
  ){
    super({
      secretOrKey: configService.get('JWT_SECRET')!,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }
  
  async validate(payload : JwtPayloadInterface): Promise<JwtPayloadInterface> {  
    const { gameId, playerId } = payload;

    const player = await this.playerRepository.findOneBy({
      id: playerId,
      game: {id: gameId}
    });

    if(!player){
      const i18n = I18nContext.current<I18nTranslations>();    
      throw new UnauthorizedException(i18n?.t('exceptions.unauthorized'));
    }

    return {...payload};
  }



}