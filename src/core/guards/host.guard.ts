import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PlayerService } from 'src/api/game/services/player.service';
import { JwtPayloadInterface } from '../interface/jwt.interface';

@Injectable()
export class HostGuard implements CanActivate {
  constructor(@Inject(PlayerService) private readonly playerService: PlayerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.switchToHttp().getRequest().user as JwtPayloadInterface;

    if (!headers) {
      throw new InternalServerErrorException('Headers not found');
    }

    const player = await this.playerService.findOne(headers.playerId);

    if (!player) {
      throw new BadRequestException('player not found');
    }

    if (!player.host) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
