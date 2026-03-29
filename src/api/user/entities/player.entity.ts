import { Game } from "src/api/game/entities/game.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlayerDto } from "../dto/player.dto";

@Entity({name: 'player'})
export class Player {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type:'text', unique: true})
  name: string;

  @Column({type:'text', unique: true, nullable: true})
  avatarImg: string;

  @ManyToOne(() => Game, game => game.player, { eager: true, cascade: true })
  game: Game

  static toPlain(player: Player) : PlayerDto {

    return {
      name: player.name,
      avatarImg: player.avatarImg,
      game: Game.toPlain(player.game)
    };

  }


}
