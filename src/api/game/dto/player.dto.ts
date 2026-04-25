import { GameDto } from 'src/api/game/dto/game.dto';
import { UserRoles } from 'src/core/enum/roles.enum';

export interface PlayerDto {
  id: string;
  name: string;
  host: boolean;
  avatarImg: boolean;
  impostor: boolean;
  roles: UserRoles[];
  createdAt: number;
  updatedAt: number;
  game?: GameDto;
}
