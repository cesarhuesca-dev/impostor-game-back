import { GameDto } from "src/api/game/dto/game.dto";

export interface PlayerDto {

  id: string;
  name: string;
  host: boolean;
  avatarImg: boolean;
  impostor: boolean;
  
  game?: GameDto

}
